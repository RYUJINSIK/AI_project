from django.db import models

from apps.core.models import TimeStampModel
from apps.user.models import User

from .utils import upload_to


class RecordVideo(TimeStampModel):
    video_url = models.FileField(upload_to=upload_to, default="posts/default")
    user_id = models.ForeignKey(
        User, on_delete=models.CASCADE,
        db_column="user_id",
        default=""
    )

    class Meta:
        db_table = "record_video"
