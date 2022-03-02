from django.urls import path

from .views import LearningVideoView,LearningVideoDifficultyView

urlpatterns = [
    path("upload/<str:video_name>", LearningVideoView.as_view(), name="video"),
    path("upload/", LearningVideoView.as_view(), name="video"),
    path("list/<str:difficulty>", LearningVideoDifficultyView.as_view(), name="list"),
]
