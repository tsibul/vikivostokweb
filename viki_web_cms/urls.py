from django.urls import path
from . import views

app_name = 'viki_web_cms'
urlpatterns = [
    path('', views.main_cms, name='main'),
    path('json/field_names/<str:class_name>', views.field_names),
    path('json/field_values/<str:class_name>/<int:deleted>/<int:first_record>/<str:search_string>', views.field_values),
    path('json/record_info/<str:class_name>/<int:record_id>', views.record_info),

]
