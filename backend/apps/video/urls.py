from django.urls import path

from .views import LearningVideoDifficultyView, LearningVideoView

urlpatterns = [
    path(
        "upload/<str:video_name>",
        LearningVideoView.as_view(),
        name="video"
    ),
    path(
        "upload/",
        LearningVideoView.as_view(),
        name="video"
    ),
    path(
        "list/<str:difficulty>",
        LearningVideoDifficultyView.as_view(),
        name="list"
    ),
]
