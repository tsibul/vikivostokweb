# Generated by Django 5.1.5 on 2025-03-20 12:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('viki_web_cms', '0034_box_packing'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='printdata',
            options={'ordering': ['name', 'print_place'], 'verbose_name': 'Данные печати', 'verbose_name_plural': 'Данные печати'},
        ),
    ]
