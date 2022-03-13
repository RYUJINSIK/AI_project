from django.urls import path

from .views import CenterView


urlpatterns = [
    path("search/<str:lat>/<str:lng>", CenterView.as_view()),
]
