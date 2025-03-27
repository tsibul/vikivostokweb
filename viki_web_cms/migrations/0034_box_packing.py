# Generated by Django 5.1.5 on 2025-03-16 20:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('viki_web_cms', '0033_alter_goodsdimensions_goods'),
    ]

    operations = [
        migrations.CreateModel(
            name='Box',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=140, verbose_name='название')),
                ('deleted', models.BooleanField(db_default=False, default=False, verbose_name='удалено')),
                ('length', models.IntegerField()),
                ('width', models.IntegerField()),
                ('height', models.IntegerField()),
                ('volume', models.FloatField()),
            ],
            options={
                'verbose_name': 'Гофрокороб',
                'verbose_name_plural': 'Гофрокороба',
                'db_table': 'box',
                'db_table_comment': 'Box',
                'ordering': ['name'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Packing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=140, verbose_name='название')),
                ('deleted', models.BooleanField(db_default=False, default=False, verbose_name='удалено')),
                ('quantity_in', models.IntegerField()),
                ('box_weight', models.FloatField()),
                ('box', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='viki_web_cms.box')),
                ('goods', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='viki_web_cms.goods')),
            ],
            options={
                'verbose_name': 'Упаковка',
                'verbose_name_plural': 'Упаковки',
                'db_table': 'packing',
                'db_table_comment': 'Packing',
                'ordering': ['goods__article', 'goods__name'],
                'abstract': False,
            },
        ),
    ]
