from django.urls import path

from .views import MapView, TestView

urlpatterns = [
    path('', TestView.as_view(), name='test'),
    path("search/", MapView.as_view(), name="map"),
]
