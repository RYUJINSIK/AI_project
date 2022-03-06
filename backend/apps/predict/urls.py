from django.urls import path

from .views import PredictScoreView, VideoPatchView, VideoView

urlpatterns = [
    path("upload/", VideoView.as_view(), name="upload"),
    path("change/", VideoPatchView.as_view(), name="change"),
    path("score/", PredictScoreView.as_view(), name="score"),
]
