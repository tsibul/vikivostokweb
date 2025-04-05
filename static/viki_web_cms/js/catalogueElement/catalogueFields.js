/**
 * @fileoverview Module containing field definitions for catalogue items
 * @module catalogueElement/catalogueFields
 */

'use strict'

/**
 * Field parameters for catalogue items
 * @type {Array<Object>} Array of field configuration objects
 * @property {string} field - Field name
 * @property {string} type - Field type (boolean, string, foreign, img)
 * @property {string} label - Display label for the field
 * @property {boolean} [null] - Whether the field can be null
 * @property {string} [foreignClass] - Class name for foreign key fields
 * @property {string} [url] - URL prefix for image fields
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