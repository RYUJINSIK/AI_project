from django.urls import path

from .views import (LearningVideoCategoryView, LearningVideoDifficultyView,
                    LearningVideoView)

urlpatterns = [
    path(
        "upload/<str:video_name>",
        LearningVideoView.as_view(),
        name="video"
    ),
    path(
        "diff_list/<str:difficulty>",
        LearningVideoDifficultyView.as_view(),
        name="list_difficulty"
    ),
]
