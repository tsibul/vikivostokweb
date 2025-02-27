'use strict'

/**
 * field parameters for catalogue
 * @type {[{field: string, type: string, label: string},{field: string, type: string, label: string, null: boolean},{field: string, type: string, label: string, null: boolean},{field: string, type: string, label: string, foreignClass: string, null: boolean},{field: string, type: string, label: string, url: string, null: boolean},null,null,null]}
 */
export const catalogueFields = [
    {
        'field': 'deleted',
        'type': 'boolean',
        'label': 'уд.',
    },
    {
        'field': 'name',
        'type': 'string',
        'label': 'название',
        'null': false,
    },
    {
        'field': 'item_article',
        'type': 'string',
        'label': 'артикул',
        'null': false,
    },
    {
        'field': 'main_color',
        'type': 'foreign',
        'label': 'осн. цвет',
        'foreignClass': 'Color',
        'null': false,
    },
    {
        'field': 'goods_option',
        'type': 'foreign',
        'label': 'опция',
        'foreignClass': 'GoodsOption',
        'null': false,
    }, {
        'field': 'image',
        'type': 'img',
        'label': 'фото',
        'url': '/static/viki_web_cms/files/item_photo/',
        'null': true,
    },
    {
        'field': 'simple_article',
        'type': 'boolean',
        'label': 'ст. арт.',
    },
    {
        'field': 'goods',
        'type': 'foreign',
        'label': 'номенклатура',
        'foreignClass': 'Goods',
        'null': false,
    },
    {
        'field': 'image_file',
        'type': 'file',
        'label': 'файл',
        'null': true,
    },
]