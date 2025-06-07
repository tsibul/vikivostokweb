import os

from collections import defaultdict
from django.conf import settings
from django.http import JsonResponse

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
    """
    model_files = model_files_structure()
    unused_files = []

    for model_name, config in model_files.items():
        model = config['model']

        # Для моделей с несколькими директориями (как Order)
        if 'directories' in config:
            for field, directory in config['directories'].items():
                used_files = set(
                    model.objects.exclude(**{field: ''})
                    .values_list(field, flat=True)
                )
                full_path = os.path.join(settings.BASE_DIR, directory)
                unused_files.extend(check_directory(full_path, used_files, model_name, field))

        # Для моделей с одной директорией
        else:
            used_files = set()
            for field in config['fields']:
                used_files.update(
                    model.objects.exclude(**{field: ''})
                    .values_list(field, flat=True)
                )

            full_path = os.path.join(settings.BASE_DIR, config['directory'])
            unused_files.extend(check_directory(full_path, used_files, model_name, config['fields'][0]))

    return JsonResponse({'unused_files': unused_files}, safe=False)


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
    file_path = request.POST.get('file_path')
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return JsonResponse({'status': 'success'}, safe=False)
        return JsonResponse({'status': 'error'}, safe=False)
    except (OSError, PermissionError) as e:
        return JsonResponse({'status': 'error'}, safe=False)


def delete_unused_files(request):
    """
    Удаляет неиспользуемые файлы для конкретной модели или всех моделей
    :param request:
    Returns:
        dict: статистика удаления по моделям
    """
    model_name = request.POST.get('model_name')
    unused = get_unused_files()
    stats = defaultdict(int)

    for model, files in unused.items():
        if model_name and model != model_name:
            continue

        for file_path in files:
            try:
                os.remove(file_path)
                stats[model] += 1
            except (OSError, PermissionError) as e:
                print(f"Ошибка при удалении {file_path}: {e}")

    return dict(stats)
