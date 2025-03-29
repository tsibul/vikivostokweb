from django.urls import path
from . import views

app_name = 'viki_web_customer'

urlpatterns = [
    path('', views.main_customer, name='main'),
]
