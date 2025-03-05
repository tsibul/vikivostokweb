from datetime import datetime

from django.db.models import F
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from viki_web_cms.models import Price


@csrf_exempt
def save_new_price_date(request):
    if not request.user.is_authenticated:
        return JsonResponse(None, safe=False)
    date = datetime.strptime(request.POST['priceDate'], '%Y-%m-%d').date()
    new_price_date = Price(price_list_date=date)
    if request.POST.get('promoCheck'):
        new_price_date.promotion_price = True
        new_price_date.promotion_end_date = datetime.strptime(request.POST['promoDate'], '%Y-%m-%d').date()
    new_price_date.save()
    option_list = (Price.objects.filter(deleted=False)
                   .annotate(value=F('name'))
                   .values('id', 'value'))
    return JsonResponse(list(option_list), safe=False)
