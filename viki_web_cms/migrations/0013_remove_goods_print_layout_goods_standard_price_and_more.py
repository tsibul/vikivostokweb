# Generated by Django 5.1.5 on 2025-03-04 04:50

import django.core.files.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('viki_web_cms', '0012_goodsoptiongroup_remove_goodstooption_goods_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='goods',
            name='print_layout',
        ),
        migrations.AddField(
            model_name='goods',
            name='standard_price',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='catalogueitem',
            name='image',
            field=models.FileField(blank=True, null=True, storage=django.core.files.storage.FileSystemStorage(location='static/viki_web_cms/files/item_photo'), upload_to=''),
        ),
    ]
