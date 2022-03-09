from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (IdcheckView, MyPageListView, RegisterView, UserloginView,
                    UserScoreRecordView)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="signup"),
    path("idchk/", IdcheckView.as_view(), name="idchk"),
    path("login/", UserloginView.as_view(), name="login"),
    path(
        'api/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),
    path("mypage/", MyPageListView.as_view(), name="mypage"),
    path(
        "score/",
        UserScoreRecordView.as_view(),
        name='user-score'
    )
]
