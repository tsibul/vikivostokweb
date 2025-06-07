import json
import os

from collections import defaultdict
from django.conf import settings
from django.http import JsonResponse

from viki_web_cms.functions.user_validation import superuser_check, user_check
from viki_web_cms.models import Order, News, CatalogueItemPhoto, CatalogueItem, OurCompany, PrintLayout


def model_files_structure():
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
    Возвращает словарь неиспользуемых файлов, сгруппированных по моделям
    Returns:
        {
            "models": {
                "News": {
                    "name": "News",
                    "files": [
                        {
                            "field": "image",
                            "path": "/path/to/file.jpg",
                            "filename": "file.jpg"
                        }
                    ]
                },
                "Order": {
                    "name": "Order",
                    "files": [
                        {
                            "field": "branding_file",
                            "path": "/path/to/brand.pdf",
                            "filename": "brand.pdf"
                        }
                    ]
                }
            }
        }
    """
    if user_check(request):
        return JsonResponse({'status': 'error', 'message': 'недостаточно прав'}, safe=False)

    model_files = model_files_structure()
    unused_files = [] #{"models": {}}

    for model_name, config in model_files.items():
        model_class = config['model']
        model_unused_files = []

        # Для моделей с несколькими директориями (как Order)
        if 'directories' in config:
            for field_name, dir_path in config['directories'].items():
                db_files = set(
                    model_class.objects.exclude(**{field_name: ''})
                    .values_list(field_name, flat=True)
                )
                full_path = os.path.join(settings.BASE_DIR, dir_path)
                if os.path.exists(full_path):
                    model_unused_files.extend(check_directory(full_path, db_files, model_name, field_name))

        # Для моделей с одной директорией
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
                "name": model_name,
                "files": model_unused_files
            })
    context = {'dataList': unused_files}

    return JsonResponse(context)


def check_directory(full_path, used_files, model_name, field):
    """
    Проверяет директорию на неиспользуемые файлы
    """
    result = []
    if os.path.exists(full_path):
        for root, _, files in os.walk(full_path):
            for filename in files:
                file_path = os.path.join(root, filename)
                rel_path = os.path.join(os.path.basename(full_path), filename)
                if rel_path not in used_files:
                    result.append({
                        "model": model_name,
                        "field": field,
                        "path": file_path,
                        "filename": filename
                    })
    return result


def delete_file(request):
    """
    Удаляет файл по полному пути
    """
    if superuser_check(request):
        return JsonResponse({'status': 'error', 'message': 'недостаточно прав'}, safe=False)
    file_path = request.POST.get('file_path')
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return JsonResponse({'status': 'success'}, safe=False)
        return JsonResponse({'status': 'error'}, safe=False)
    except (OSError, PermissionError) as e:
        return JsonResponse({'status': 'error'}, safe=False)


def process_model_files(model_name, config, deleted, errors):
    """
    Обрабатывает файлы для конкретной модели
    """
    model_class = config['model']
    if 'directories' in config:
        # Для моделей с несколькими директориями (Order)
        for field_name, dir_path in config['directories'].items():
            db_files = set(
                model_class.objects.exclude(**{field_name: ''})
                .values_list(field_name, flat=True)
            )
            full_path = os.path.join(settings.BASE_DIR, dir_path)
            unused = check_directory(full_path, db_files, model_name, field_name)
            for file_info in unused:
                try:
                    os.remove(file_info['path'])
                    deleted.append(file_info)
                except (OSError, PermissionError) as e:
                    file_info['error'] = str(e)
                    errors.append(file_info)
    else:
        # Для моделей с одной директорией
        db_files = set()
        for field_name in config['fields']:
            db_files.update(
                model_class.objects.exclude(**{field_name: ''})
                .values_list(field_name, flat=True)
            )
        full_path = os.path.join(settings.BASE_DIR, config['directory'])
        unused = check_directory(full_path, db_files, model_name, config['fields'][0])
        for file_info in unused:
            try:
                os.remove(file_info['path'])
                deleted.append(file_info)
            except (OSError, PermissionError) as e:
                file_info['error'] = str(e)
                errors.append(file_info)


def delete_unused_files(request):
    """
    Удаляет неиспользуемые файлы для конкретной модели или всех моделей
    """
    if superuser_check(request):
        return JsonResponse({'status': 'error', 'message': 'недостаточно прав'}, safe=False)

    model_name = request.POST.get('model_name')
    deleted = []
    errors = []

    if model_name:
        config = model_files_structure().get(model_name)
        if not config:
            return JsonResponse({'status': 'error', 'message': 'модель не найдена'}, safe=False)
        process_model_files(model_name, config, deleted, errors)
    else:
        # Если модель не указана - обрабатываем все модели
        for model_name, config in model_files_structure().items():
            process_model_files(model_name, config, deleted, errors)

    return JsonResponse({
        'status': 'success' if deleted else 'error',
        'deleted': deleted,
        'errors': errors
    }, safe=False)
