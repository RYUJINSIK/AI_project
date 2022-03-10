from django.urls import path

from .views import VideoUploadView, VideoPatchView, PredictScoreView 

urlpatterns = [
    path("upload/", VideoUploadView.as_view(), name="upload"),
    path("change/", VideoPatchView.as_view(), name="change"),
    path("score/", PredictScoreView.as_view(), name="score"),
]