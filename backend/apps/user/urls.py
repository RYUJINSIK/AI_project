from django.urls import path

from .views import IdcheckView, RegisterView, UserloginView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="signup"),
    path("idchk/", IdcheckView.as_view(), name="idchk"),
    path("login/", UserloginView.as_view(), name="login"),
]
