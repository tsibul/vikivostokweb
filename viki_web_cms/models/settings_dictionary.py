from django.db import models


class SettingsDictionary(models.Model):
    name = models.CharField(max_length=140, verbose_name="название")
    deleted = models.BooleanField(default=False, verbose_name="удалено", db_default=False)

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name

    class Meta:
        abstract = True
        ordering = ['name']

    @property
    def file_url(self):
        return None

    @staticmethod
    def order_default():
        return ['name']

    @staticmethod
    def dictionary_fields():
        return [
            {
                'field': 'name',
                'type': 'string',
                'label': 'название',
                'null': False
            },
            {
                'field': 'deleted',
                'type': 'boolean',
                'label': 'удалено',
                'null': False
            },
        ]
