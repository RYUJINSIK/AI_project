from django.urls import path

from .views import VideoPatchView, VideoView

urlpatterns = [
    path("upload/", VideoView.as_view(), name="upload"),
    path("update/", VideoPatchView.as_view(), name="patch"),
]
