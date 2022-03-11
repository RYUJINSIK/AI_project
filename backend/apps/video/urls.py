from django.urls import path

from .views import (LearningVideoAllView, LearningVideoCategoryView,
                    LearningVideoDifficultyView, LearningVideoView, LearningWordListView)

urlpatterns = [
    path(
        "list/",
        LearningVideoAllView.as_view(),
        name="video_list"
    ),
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
    path(
        "category_list/<str:category>",
        LearningVideoCategoryView.as_view(),
        name="list_category"
    ),
    path(
        "random_list/<int:id>",
        LearningWordListView.as_view(),
        name="random_list"
    )
]