from django.db.models import Q, F, Value
from django.db.models.functions import Concat
from django.http import JsonResponse

from viki_web_cms.models import CatalogueItem, Goods


def catalogue_data(request, deleted, first_record, search_string, order):
    """

    :param request:
    :param deleted:
    :param first_record:
    :param search_string:
    :param order:
    :return:
    """
    if not request.user.is_authenticated:
        return JsonResponse(None, safe=False)
    if order == '0':
        order = CatalogueItem.order_default()
    if not search_string:
        if not deleted:
            items = CatalogueItem.objects.filter(deleted=False).order_by(*order)[first_record: first_record + 20]
        else:
            items = CatalogueItem.objects.all().order_by(*order)[first_record: first_record + 20]
    else:
        search_string = search_string.replace('|', ' ')
        if not deleted:
            items = CatalogueItem.objects.filter(
                Q(deleted=False) & (
                        Q(name__icontains=search_string) |
                        Q(goods__name__icontains=search_string) |
                        Q(item_article__icontains=search_string) |
                        Q(main_color__name=search_string) |
                        Q(main_color__code__icontains=search_string) |
                        Q(image__icontains=search_string)
                )
            ).order_by(*order)[first_record: first_record + 20]
        else:
            items = CatalogueItem.objects.filter(
                Q(name__icontains=search_string) |
                Q(goods__name__icontains=search_string) |
                Q(item_article__icontains=search_string) |
                Q(main_color__name=search_string) |
                Q(main_color__code__icontains=search_string) |
                Q(image__icontains=search_string)
            ).order_by(*order)[first_record: first_record + 20]
    values = list(
        items.annotate(
            goods_text=Concat(F('goods__article'), Value(' '), F('goods__name'))
        ).values(
            'name',
            'deleted',
            'item_article',
            'goods__id',
            'goods_text',
            'main_color',
            'image',
        ))
    goods = list(
        Goods.objects.filter(deleted=False).order_by(
            *Goods.order_default()
        ).annotate(
            goods_text=Concat(F('article'), Value(' '), F('name')),
        ).values(
            'id',
            'goods_text',
            'deleted',
        ))
    return JsonResponse({'values': values, 'goods': goods}, safe=False)
