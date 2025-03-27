import csv
from io import TextIOWrapper
from pathlib import Path

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from viki_web_cms.functions.webp_convertor import webp_convertor
from viki_web_cms.models import Goods, CatalogueItem, Color, GoodsOption, CatalogueItemColor


@csrf_exempt
def catalogue_csv_load(request):
    """
    check file if csv, save data
    :param request:
    :return:
    """
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Незарегистрированный пользователь'}, safe=False)
    decoded_file = TextIOWrapper(request.FILES['csv_file'], encoding='utf-8')
    try:
        reader = csv.DictReader(decoded_file, delimiter=';')
    except csv.Error:
        return JsonResponse({'error': 'Неверный формат файла'}, safe=False)
    record_success = []
    record_double = []
    record_error = []
    for row in reader:
        goods = Goods.objects.filter(article=row['article'], name=row['name']).first()
        validation = row_validation(row, goods)
        match (validation['type']):
            case 'error':
                record_error.append(validation)
            case 'double':
                record_double.append(validation)
            case 'success':
                record_success.append(validation)
    return JsonResponse({
        'recordSuccess': record_success,
        'recordSuccessLength': len(record_success),
        'recordDouble': record_double,
        'recordDoubleLength': len(record_double),
        'recordError': record_error,
        'recordErrorLength': len(record_error),
    }, safe=False)

@csrf_exempt
def catalogue_files_load(request):
    """
    check file if csv, save data
    :param request:
    :return:
    """
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Незарегистрированный пользователь'}, safe=False)
    files = request.FILES.getlist('files')
    record_success = []
    record_double = []
    record_error = []
    goods = Goods.objects.get(id=request.POST['goods_id'])
    for file in files:
        row = {'file': file.name, 'article': goods.article, 'body': file}
        validation = row_validation(row, goods)
        match (validation['type']):
            case 'error':
                record_error.append(validation)
            case 'double':
                record_double.append(validation)
            case 'success':
                record_success.append(validation)
    return JsonResponse({
        'recordSuccess': record_success,
        'recordSuccessLength': len(record_success),
        'recordDouble': record_double,
        'recordDoubleLength': len(record_double),
        'recordError': record_error,
        'recordErrorLength': len(record_error),
    }, safe=False)


def row_validation(row, goods):
    """
    validate csv row data & save to db
    :param row:
    :return:
    """
    file_name = (row['file'].split('.')[0]).split('\\')[-1]
    if not goods:
        return {'type': 'error', 'message': 'Несоответствие артикула и названия товара', 'item': file_name}
    name = goods.name
    if not file_name.startswith(row['article']):
        return {'type': 'error', 'message': 'Несоответствие названия файла и артикула товара', 'item': file_name}
    option_length = 1 if goods.goods_option_group else 0
    color_article_str = file_name[len(goods.article):]
    color_article = [color_article_str[i:i + 2] for i in range(0, len(color_article_str) - option_length, 2)]
    if option_length:
        color_article.append(color_article_str[-1:])
    if not len(color_article) == goods.details_number + option_length:
        return {'type': 'error', 'message': 'Несоответствие длины цветового кода товару', 'item': file_name}
    item_article = goods.article + '.' + '.'.join(color_article)
    double_item = CatalogueItem.objects.filter(
        item_article=item_article,
        deleted=False)
    if double_item.count():
        return {'type': 'double', 'message': 'Дубль существующей позиции', 'item': file_name}
    colors_to_save = []
    temp_color_id = -1
    for i in range(0, goods.details_number):
        if (goods.additional_material and i < goods.details_number - 1) or not goods.additional_material:
            current_color = Color.objects.filter(
                color_scheme=goods.color_scheme,
                code=color_article[i],
                deleted=False).first()
            if (not goods.multicolor
                    and i
                    and current_color.id != temp_color_id
                    or not current_color
            ):
                return {'type': 'error', 'message': 'Несуществующий цвет', 'item': file_name}
            temp_color_id = current_color.id
        else:
            current_color = Color.objects.filter(
                color_scheme=goods.additional_color_scheme,
                code=color_article[i],
                deleted=False).first()
            if not current_color:
                return {'type': 'error', 'message': 'Несуществующий дополнительный цвет', 'item': file_name}
        if goods.multicolor or goods.additional_material or i == 0:
            name = name + '/' + current_color.name
        if goods.multicolor or goods.additional_material or i == 0:
            name = name + '/' + current_color.name
        colors_to_save.append({
            'color': current_color,
            'color_position': i + 1,
        })
    if option_length:
        new_option = GoodsOption.objects.filter(
            option_group=goods.goods_option_group,
            option_article=color_article[-1],
            deleted=False).first()
        if new_option:
            name = name + '/' + new_option.name
        else:
            return {'type': 'error', 'message': 'Несуществующая опция', 'item': file_name}
    else:
        new_option = None
    catalogue_item = CatalogueItem(
        name=name,
        deleted=False,
        item_article=item_article,
        goods=goods,
        main_color=colors_to_save[0]['color'],
        simple_article=True,
        goods_option=new_option,
    )
    if 'body' in row.keys():
        if (row['file'].split('.')[-1] != 'jpeg' and
            row['file'].split('.')[-1] != 'jpg' and
            row['file'].split('.')[-1] != 'png'):
            return {'type': 'error', 'message': 'Неверный формат файла', 'item': file_name}
        webp_image = webp_convertor(row['body'])
        catalogue_item.image.save(webp_image.name, webp_image)
    else:
        unix_path =  Path(row['file']).as_posix()
        with open(unix_path, "rb") as f:
            webp_image = webp_convertor(f)
            catalogue_item.image.save(file_name + '.webp', webp_image)
    catalogue_item.save()
    catalogue_item_colors = []
    for color in colors_to_save:
        catalogue_item_color = CatalogueItemColor(
            name=color['color'].name,
            color=color['color'],
            color_position=color['color_position'],
            item=catalogue_item,
        )
        catalogue_item_color.save()
        catalogue_item_colors.append(catalogue_item_color)
    return {
        'type': 'success',
        'message': catalogue_item.item_article + ' загружен',
        'item': file_name,
    }
