# Generated by Django 5.1.5 on 2025-03-06 09:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('viki_web_cms', '0021_remove_priceitemstandard_item_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='PriceGoodsStandard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=140, verbose_name='название')),
                ('deleted', models.BooleanField(db_default=False, default=False, verbose_name='удалено')),
                ('price', models.FloatField(default=0)),
                ('goods', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='viki_web_cms.goods')),
                ('price_list', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='viki_web_cms.price')),
                ('price_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='viki_web_cms.standardpricetype')),
            ],
            options={
                'verbose_name': 'Goods Price',
                'verbose_name_plural': 'Goods Prices',
                'db_table': 'goods_price',
                'db_table_comment': 'goods price',
                'ordering': ['goods__product_group__priority', 'goods__article', 'goods__name'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PriceItemStandard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=140, verbose_name='название')),
                ('deleted', models.BooleanField(db_default=False, default=False, verbose_name='удалено')),
                ('price', models.FloatField(default=0)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='viki_web_cms.catalogueitem')),
                ('price_list', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='viki_web_cms.price')),
                ('price_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='viki_web_cms.standardpricetype')),
            ],
            options={
                'verbose_name': 'Item Price',
                'verbose_name_plural': 'Item Prices',
                'db_table': 'item_price',
                'db_table_comment': 'item price',
                'ordering': ['item__item_article'],
                'abstract': False,
            },
        ),
    ]
