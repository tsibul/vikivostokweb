# Generated by Django 5.1.5 on 2025-03-16 15:46

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('viki_web_cms', '0032_goodsdimensions_goods'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goodsdimensions',
            name='goods',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='viki_web_cms.goods'),
        ),
    ]
