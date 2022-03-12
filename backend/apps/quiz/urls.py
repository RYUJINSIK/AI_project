from django.urls import path

from .views import QuizView

urlpatterns = [
    path(
        "type/<int:collection_id>",
        QuizView.as_view(),
        name="quiztype"
        ),
]