# Generated by Django 5.1.5 on 2025-02-27 21:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('viki_web_cms', '0011_alter_catalogueitem_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='GoodsOptionGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=140, verbose_name='название')),
                ('deleted', models.BooleanField(db_default=False, default=False, verbose_name='удалено')),
            ],
            options={
                'verbose_name': 'Модификация товара',
                'verbose_name_plural': 'Модификации товаров',
                'db_table': 'goods_option_group',
                'db_table_comment': 'Goods options',
                'ordering': ['name'],
                'abstract': False,
            },
        ),
        migrations.RemoveField(
            model_name='goodstooption',
            name='goods',
        ),
        migrations.RemoveField(
            model_name='goodstooption',
            name='goods_options',
        ),
        migrations.AddField(
            model_name='catalogueitem',
            name='goods_option',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='viki_web_cms.goodsoption'),
        ),
        migrations.AddField(
            model_name='goods',
            name='goods_option_group',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='viki_web_cms.goodsoptiongroup'),
        ),
        migrations.AddField(
            model_name='goodsoption',
            name='option_group',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='viki_web_cms.goodsoptiongroup'),
        ),
        migrations.DeleteModel(
            name='CatalogueItemOption',
        ),
        migrations.DeleteModel(
            name='GoodsToOption',
        ),
    ]
