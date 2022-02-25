from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
<<<<<<< HEAD
from django.urls import include, path
=======
from django.urls import path, include
>>>>>>> ff81d3f7ceb1135becb55af6279acb12d4b128b7
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="Portfolio API",
        default_version="v1",
        description="Test description",
        terms_of_service="https://www.orapp.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
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
<<<<<<< HEAD
    path('map/', include('apps.map.urls'), name='map'),
    path('video/', include('apps.video.urls'), name='video'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
=======
    path('video/', include('apps.video.urls'), name='video'),
    path('user/', include('apps.user.urls'), name='user')
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_URL)
>>>>>>> ff81d3f7ceb1135becb55af6279acb12d4b128b7
