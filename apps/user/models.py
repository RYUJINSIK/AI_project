from django.db import models


class Trx(models.Model):
    name = models.CharField(max_length=20)
    email = models.EmailField(max_length=100)
    
    def __str__(self):
        return self.name
    
    class Meta:
        app_label = 'apps.user'
