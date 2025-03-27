from django.urls import path
from . import views

app_name = 'viki_web'
urlpatterns = [
    path('', views.index, name='main'),
    path('products/<str:product_group_url>', views.product, name='products'),
    path('products/<str:product_group_url>/<str:filter_type>', views.product_filter, name='product_filter'),

    path('send-password/', views.send_temp_password, name='send_temp_password'),
    path('login-temp/', views.login_with_temp_password, name='login'),
    path('change-password/', views.change_password, name='change_password'),
]
