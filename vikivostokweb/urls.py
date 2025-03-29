from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('viki_web.urls')),
    path('cms/', include('viki_web_cms.urls')),
    path('customer/', include('viki_web_customer.urls')),
]
