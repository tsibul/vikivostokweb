from django.shortcuts import render

from viki_web.views import find_price_type, goods_price
from viki_web_cms.models import ProductGroup, Goods, CatalogueItem


def index(request):
    categories = ProductGroup.objects.filter(deleted=False)
    new_items_request = Goods.objects.filter(deleted=False, new=True)
    new_items = []
    for item in new_items_request:
        price_type = find_price_type(request)
        price, price_volume = goods_price(item, price_type)
        catalogue_item = CatalogueItem.objects.filter(goods=item, deleted=False).order_by('?').first()
        if catalogue_item:
            new_items.append({'price': price, 'image': catalogue_item.image, 'name': item.name,
                                  'slug': item.slug, 'price_volume': price_volume})

    context = {'categories': categories, 'user': request.user, 'new_items': new_items}
    return render(request, 'index.html', context)
