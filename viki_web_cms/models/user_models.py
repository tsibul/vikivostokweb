from django.contrib.auth.models import User
from django.db import models


class UserPhone(models.Model):
    """ user phone """
    phone = models.CharField(max_length=14)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'телефон'
        verbose_name_plural = 'Телефоны'
        db_table_comment = 'phone'
        db_table = 'user_phone'
        ordering = ['user__last_name']

    @staticmethod
    def order_default():
        return ['user__last_name']