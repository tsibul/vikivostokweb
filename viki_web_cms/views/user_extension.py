from django.db.models import Q
from django.http import JsonResponse
from django.contrib.auth.models import User
from viki_web_cms.models.user_models import UserExtension
from viki_web_cms.functions.user_validation import user_check


def user_extension(request):
    """
    View to provide user data for the frontend user element
    Supports filtering by search string and new status
    
    Query parameters:
    - search: search string to filter by name, email, or phone
    - new: filter by new status (1 for new users only, 0 for all)
    - last_record: number of last record to start from (pagination)
    """
    # Проверяем аутентификацию пользователя
    if user_check(request):
        return JsonResponse({"userList": [], "last_record": 0})

    search_string = request.GET.get('search', '')
    new_filter = request.GET.get('new', '')
    last_record = int(request.GET.get('last_record', 0))

    # Query user extensions joined with User, excluding staff
    user_query = UserExtension.objects.select_related('user', 'customer').filter(
        user__is_staff=False
    )

    # Apply new filter if requested
    if new_filter == '1':
        user_query = user_query.filter(new=True)

    # Apply search filter if provided
    if search_string:
        user_query = user_query.filter(
            Q(user__last_name__icontains=search_string) |
            Q(user__first_name__icontains=search_string) |
            Q(user__email__icontains=search_string) |
            Q(phone__icontains=search_string) |
            Q(customer__name__icontains=search_string)
        )

    # Order by default ordering
    user_query = user_query.order_by(*UserExtension.order_default())

    # Paginate results (20 records per page)
    users_data = user_query[last_record:last_record + 20]

    # Prepare result data
    result = []
    for user_ext in users_data:
        user = user_ext.user
        result.append({
            'id': user.id,
            'last_name': user.last_name,
            'first_name': user.first_name,
            'email': user.email,
            'phone': user_ext.phone,
            'alias': user_ext.alias,
            'new': user_ext.new,
            'manager_letter': user_ext.manager_letter or '',
            'customer': user_ext.customer.name if user_ext.customer else ''
        })

    return JsonResponse({
        'userList': result,
        'last_record': last_record + len(result)
    })
