from django.contrib.auth.decorators import login_required
from django.db.models import Q, F
from django.http import JsonResponse
from viki_web_cms.models.user_models import UserExtension
from viki_web_cms.models.customer_models import Customer
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
        return JsonResponse({"dataList": [], "last_record": 0})

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
            'customer': user_ext.customer.name if user_ext.customer else ''
        })

    return JsonResponse({
        'dataList': result,
        'last_record': last_record + len(result)
    })


@login_required()
def user_extension_item(request, user_id):
    """
    View to get detailed data for a single user
    URL parameters:
    - user_id: ID of the user to retrieve
    """
    if user_check(request):
        return JsonResponse({"error": "Authentication required"}, status=401)
    try:
        user_ext = UserExtension.objects.select_related('user', 'customer').get(user_id=user_id)
        user = user_ext.user
        customers = list(Customer.objects.filter(deleted=False).annotate(
            value=F('name')
        ).values(
            'id',
            'value'
        ))
        return JsonResponse({
            'id': user.id,
            'alias': user_ext.alias,
            'new': user_ext.new,
            'manager_letter': user_ext.manager_letter or '',
            'customer_id': user_ext.customer.id if user_ext.customer else '',
            'customer': user_ext.customer.name if user_ext.customer else '',
            'customers': customers
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@login_required
def update_user_extension(request, user_id):
    """
    View to update user extension data
    POST parameters:
    - user_id: ID of the user to update
    - new_status: New status (1 for true, 0 for false) 
    - manager_letter: Manager letter
    - customer_id: ID of customer
    """
    # Проверяем аутентификацию пользователя
    if user_check(request):
        return JsonResponse({"error": "Authentication required", "success": False}, status=401)

    # Check if this is a POST request
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required", "success": False}, status=405)

    try:
        # Get POST parameters
        new_status = request.POST.get('new') == 'on'
        alias = request.POST.get('alias', '')
        customer_id = request.POST.get('customer', '')
        # Get user extension record
        user_ext = UserExtension.objects.get(user_id=user_id)

        # Update fields
        user_ext.new = new_status
        user_ext.alias = alias
        # Update customer if provided
        if customer_id:
            customer = Customer.objects.get(id=customer_id, deleted=False)
            user_ext.customer = customer
        else:
            user_ext.customer = None
        # Save changes
        user_ext.save()
        context = {
            "success": True,
            'new': new_status,
            'alias': alias,
            'customer': user_ext.customer.name if user_ext.customer else '',
        }

        return JsonResponse(context)
    except Exception as e:
        return JsonResponse({"error": str(e), "success": False}, status=500)
