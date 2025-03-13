from django.http import JsonResponse


def user_check(request):
    user = request.user
    if not user.is_authenticated:
        return True
    if user.groups:
        user_groups = [group.name for group in user.groups.all()]
        if 'cms_staff' not in user_groups:
            return True
    return False
