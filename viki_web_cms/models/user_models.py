from django.contrib.auth.models import User
from django.db import models

from viki_web_cms.models import Customer


class UserExtension(models.Model):
    """ user phone """
    phone = models.CharField(max_length=18)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    alias = models.CharField(max_length=140)

    class Meta:
        verbose_name = 'Доп. информация о пользователе'
        verbose_name_plural = 'Доп. информация о пользователе'
        db_table_comment = 'UserExtension'
        db_table = 'user_extension'
        ordering = ['user__last_name']

    @staticmethod
    def order_default():
        return ['user__last_name']