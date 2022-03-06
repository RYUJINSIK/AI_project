from django.urls import path

from .views import MapView

# from .views import TestView

urlpatterns = [
    path("search/<str:lat>/<str:lng>", MapView.as_view()),
]
