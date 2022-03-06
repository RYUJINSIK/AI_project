from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="Team9 OPEN API",
        default_version="v1",
        description="Elice Team9의 OPEN API 문서 페이지 입니다.",
        terms_of_service="https://www.orapp.com/policies/terms/",
        contact=openapi.Contact(email="ingi9786@naver.com"),
        license=openapi.License(name="Test License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "readoc/",
        schema_view.with_ui("redoc", cache_timeout=0),
        name="schema-redoc",
    ),
    path(
        "",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("signcenter/", include("apps.signcenter.urls"), name="signcenter"),
    path("video/", include("apps.video.urls"), name="video"),
    path("predict/", include("apps.predict.urls"), name='predict'),
    path("user/", include("apps.user.urls"), name='user'),
    path("quiz/", include("apps.quiz.urls"), name='quiz'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
