from django.urls import path

from .views import VideoPatchView, VideoView, PredictScoreView

urlpatterns = [
    path("upload/", VideoView.as_view(), name="upload"),
    path("update/", VideoPatchView.as_view(), name="patch"),
    path("score/<int:user_id>", PredictScoreView.as_view(), name="score"),
    # path("score/<int:user_id>/", PredictScoreView.as_view(), name="score"),
]

