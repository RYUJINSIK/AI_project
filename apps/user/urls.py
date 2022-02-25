from django.urls import path

from .views import UserView

urlpatterns = [
<<<<<<< HEAD
    path('', UserView.as_view(), name='user'),
=======
    path('user/', UserView.as_view(), name='user'),
>>>>>>> ff81d3f7ceb1135becb55af6279acb12d4b128b7
]
