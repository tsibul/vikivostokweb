from django.urls import path
from . import views

app_name = 'viki_web'
urlpatterns = [
path('', views.index, name='main'),
    path('products/<str:product_group_url>', views.product, name='products'),
]