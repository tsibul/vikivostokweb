# Generated by Django 5.1.5 on 2025-03-16 15:46

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('viki_web_cms', '0031_alter_articledescription_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='goodsdimensions',
            name='goods',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='viki_web_cms.goods'),
        ),
    ]
