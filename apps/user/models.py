from django.db import models


<<<<<<< HEAD
class Trx(models.Model):
=======
class User(models.Model):
>>>>>>> ff81d3f7ceb1135becb55af6279acb12d4b128b7
    name = models.CharField(max_length=20)
    email = models.EmailField(max_length=100)
    
    def __str__(self):
        return self.name
<<<<<<< HEAD
    
    class Meta:
        app_label = 'apps.user'
=======

>>>>>>> ff81d3f7ceb1135becb55af6279acb12d4b128b7
