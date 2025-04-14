from django.urls import path
from . import views

app_name = 'viki_web'
urlpatterns = [
    path('', views.index, name='main'),
    path('products/<str:product_group_url>', views.product, name='products'),
    path('products/<str:product_group_url>/<str:filter_type>', views.product_filter, name='product_filter'),

    path('send-password/', views.send_temp_password, name='send_temp_password'),
    path('log-temp/', views.login_with_temp_password, name='login-temp'),
    path('change-password/', views.change_password, name='change_password'),
    path('log-out/', views.log_out, name='log-out'),
    path('log-in/', views.log_in, name='log-in'),
    path('cabinet/', views.cabinet, name='cabinet'),
    path('cabinet_data/', views.cabinet_data, name='cabinet_data'),

    path('cabinet/save/<str:form_type>', views.cabinet_save, name='cabinet_save'),
    path('save_new_company/', views.save_new_company, name='save_new_company'),
    path('check_company/', views.company_create, name='check_company'),
    path('check_bank/', views.check_bank, name='check_bank'),
    path('save_bank_account/', views.save_bank_account, name='save_bank_account'),
    path('product/<str:product_name>', views.product_detail, name='product_detail'),
    path('shablon', views.layout, name='layout' ),
    path('price', views.price, name='price'),
]
