from django.urls import path

from .views import MapView

# from .views import TestView

urlpatterns = [
    # path('', TestView.as_view(), name='test'),
    path("search/", MapView.as_view(), name="map"),
]
