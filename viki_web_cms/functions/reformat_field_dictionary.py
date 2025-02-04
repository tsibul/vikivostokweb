from viki_web_cms import models


def reformat_field_dictionary(class_name):
    """
    function to have dictionary with key=field_name, value=field_params
    :param class_name:
    :return:
    """
    class_entity = getattr(models, class_name)
    field_array = class_entity.dictionary_fields()
    field_dictionary = {}
    for field in field_array:
        field_copy = field.copy()
        del field_copy['field']
        field_dictionary[field['field']] = field_copy
    return field_dictionary