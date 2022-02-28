from django.urls import path

from .views import IdcheckView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="signup"),
    path("idchk/", IdcheckView.as_view(), name="idchk"),
]
