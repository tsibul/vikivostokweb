import os

from django.conf import settings
from django.http import JsonResponse

from viki_web_cms.functions.user_validation import superuser_check, user_check
from viki_web_cms.models import Order, News, CatalogueItemPhoto, CatalogueItem, OurCompany, PrintLayout


def model_files_structure():
    """
    Returns configuration of file fields for each model.

    :return dict: Model configurations with their file fields and directories
    """
    return {
        'CatalogueItem': {
            'model': CatalogueItem,
            'fields': ['image'],
            'directory': 'static/viki_web_cms/files/item_photo'
        },
        'CatalogueItemPhoto': {
            'model': CatalogueItemPhoto,
            'fields': ['add_photo'],
            'directory': 'static/viki_web_cms/files/item_add_photo'
        },
        'News': {
            'model': News,
            'fields': ['image'],
            'directory': 'static/viki_web_cms/files/news'
        },
        'Order': {
            'model': Order,
            'fields': ['branding_file', 'invoice_file', 'delivery_file'],
            'directories': {
                'branding_file': 'static/viki_web_cms/files/order/branding',
                'invoice_file': 'static/viki_web_cms/files/order/invoice',
                'delivery_file': 'static/viki_web_cms/files/order/delivery'
            }
        },
        'OurCompany': {
            'model': OurCompany,
            'fields': ['signature'],
            'directory': 'viki_web_cms/files/our_company/signature'
        },
        'PrintLayout': {
            'model': PrintLayout,
            'fields': ['layout'],
            'directory': 'static/viki_web_cms/files/layout'
        }
    }


def get_unused_files(request):
    """
    Returns a dictionary of unused files grouped by models.

    :param HttpRequest request: Request with user permissions
    :return JsonResponse: {{
        "dataList": [
            {{
                "name": str,      # Model name
                "length": int,    # Number of unused files
                "files": list     # List of file info dicts
            }}
        ]
    }}
    """
    if user_check(request):
        return JsonResponse({'status': 'error', 'message': 'insufficient permissions'}, safe=False)

    model_files = model_files_structure()
    unused_files = []

    for model_name, config in model_files.items():
        model_class = config['model']
        model_unused_files = []

        # For models with multiple directories (like Order)
        if 'directories' in config:
            for field_name, dir_path in config['directories'].items():
                db_files = set(
                    model_class.objects.exclude(**{field_name: ''})
                    .values_list(field_name, flat=True)
                )
                full_path = os.path.join(settings.BASE_DIR, dir_path)
                if os.path.exists(full_path):
                    model_unused_files.extend(check_directory(full_path, db_files, model_name, field_name))

        # For models with single directory
        else:
            db_files = set()
            for field_name in config['fields']:
                db_files.update(
                    model_class.objects.exclude(**{field_name: ''})
                    .values_list(field_name, flat=True)
                )

            full_path = os.path.join(settings.BASE_DIR, config['directory'])
            if os.path.exists(full_path):
                model_unused_files.extend(check_directory(full_path, db_files, model_name, config['fields'][0]))

        if model_unused_files:
            unused_files.append({
                'name': model_name,
                'length': len(model_unused_files),
                'files': model_unused_files
            })
    context = {'dataList': unused_files}

    return JsonResponse(context)


def check_directory(full_path, db_files, model_name, field):
    """
    Checks for unused files in a directory by comparing filesystem with database records.

    :param LiteralString full_path: Absolute path to check
    :param set db_files: Set of filenames from database
    :param str model_name: Model name
    :param str field: Field name
    :return list: List of dicts {model, field, path, filename} for unused files
    """
    result = []
    if os.path.exists(full_path):
        for root, _, files in os.walk(full_path):
            for filename in files:
                if filename not in db_files:
                    # Get path from structure and add filename
                    config = model_files_structure()[model_name]
                    if 'directories' in config:
                        rel_path = f"{config['directories'][field]}/{filename}"
                    else:
                        rel_path = f"{config['directory']}/{filename}"
                    result.append({
                        "model": model_name,
                        "field": field,
                        "path": rel_path,
                        "filename": filename
                    })
    return result


def delete_file(request):
    """
    Deletes a file by its relative path from static directory.

    :param HttpRequest request: Contains file_path to delete
    :return JsonResponse: {status: str, message?: str}
    """
    if superuser_check(request):
        return JsonResponse({'status': 'error', 'message': 'insufficient permissions'}, safe=False)
    
    rel_path = request.POST.get('file_path')
    if not rel_path:
        return JsonResponse({'status': 'error', 'message': 'file path not specified'}, safe=False)
    
    # Use BASE_DIR since rel_path already contains static/
    abs_path = os.path.join(settings.BASE_DIR, rel_path)
    try:
        if os.path.exists(abs_path):
            os.remove(abs_path)
            return JsonResponse({'status': 'success'}, safe=False)
        return JsonResponse({'status': 'error', 'message': 'file not found'}, safe=False)
    except (OSError, PermissionError) as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, safe=False)


def process_model_files(model_name, config, deleted, errors):
    """
    Process files for a model config, delete unused ones.

    :param str model_name: Model to process
    :param dict config: Model config from model_files_structure()
    :param list deleted: List to store deleted files info
    :param list errors: List to store errors
    :return tuple: (deleted: list, errors: list)
    """
    def files_deleted(unused_files, deleted_files, errors_deleting):
        for file_info in unused_files:
            try:
                # Use BASE_DIR since path already contains static/
                abs_path = os.path.join(settings.BASE_DIR, file_info['path'])
                os.remove(abs_path)
                deleted_files.append(file_info)
            except (OSError, PermissionError) as e:
                file_info['error'] = str(e)
                errors_deleting.append(file_info)
        return deleted_files, errors_deleting

    model_class = config['model']

    if 'directories' in config:
        # For models with multiple directories (like Order)
        for field_name, dir_path in config['directories'].items():
            db_files = set(
                model_class.objects.exclude(**{field_name: ''})
                .values_list(field_name, flat=True)
            )
            full_path = os.path.join(settings.BASE_DIR, dir_path)
            unused = check_directory(full_path, db_files, model_name, field_name)
            files_deleted(unused, deleted, errors)
    else:
        # For models with single directory
        db_files = set()
        for field_name in config['fields']:
            db_files.update(
                model_class.objects.exclude(**{field_name: ''})
                .values_list(field_name, flat=True)
            )
        full_path = os.path.join(settings.BASE_DIR, config['directory'])
        unused = check_directory(full_path, db_files, model_name, config['fields'][0])
        files_deleted(unused, deleted, errors)
    return deleted, errors


def delete_unused_files(request):
    """
    Delete unused files for specific model or all models.

    :param HttpRequest request: Contains optional model_name
    :return JsonResponse: {status: str, deleted: list, errors: list}
    """
    if superuser_check(request):
        return JsonResponse({'status': 'error', 'message': 'insufficient permissions'}, safe=False)

    model_name = request.POST.get('model_name')
    deleted = []
    errors = []

    config = model_files_structure().get(model_name)
    if not config:
        return JsonResponse({'status': 'error', 'message': 'model not found'}, safe=False)
    process_model_files(model_name, config, deleted, errors)

    return JsonResponse({
        'status': 'success' if deleted else 'error',
        'deleted': deleted,
        'errors': errors
    }, safe=False)
