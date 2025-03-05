from django.urls import path
from . import views

app_name = 'viki_web_cms'
urlpatterns = [
    path('', views.main_cms, name='main'),
    path('json/field_names/<str:class_name>', views.field_names),
    path('json/field_values/<str:class_name>/<int:deleted>/<int:first_record>/<str:search_string>', views.field_values),
    path('json/record_info/<str:class_name>/<int:record_id>', views.record_info),
    path('json/dropdown_list/<str:class_name>', views.dropdown_list),
    path('json/edit_dictionary/<str:class_name>/<int:element_id>', views.edit_dictionary),
    path('json/catalogue_data/<int:deleted>/<int:first_record>/<str:search_string>/<str:order>', views.catalogue_data),
    path('json/parse_file_data/<int:goods_id>/<int:simple_article>/<str:file_name>/<int:item_id>', views.parse_file_data),

    path('json/catalogue_record/<int:record_id>', views.catalogue_record),
    path('json/save_catalogue_item/<int:record_id>', views.save_catalogue_item),
    path('json/catalogue_csv_load', views.catalogue_csv_load),
    path('json/catalogue_files_load', views.catalogue_files_load),
    path('json/save_new_price_date', views.save_new_price_date),

]
