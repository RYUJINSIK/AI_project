from django.urls import path

from .views import QuizView

urlpatterns = [
    path(
        "choicelist/<int:collection_id>",
        QuizView.as_view(),
        name="choicelist"
        ),
]
