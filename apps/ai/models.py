from datetime import datetime

from django.db import models

from apps.core.models import TimeStampModel
from apps.user.models import User


def upload_to(instance, filename):
    cur_time = str(datetime.today().strftime("%Y-%m-%d_%H-%M-%S"))
    return "recorded/{}/{}/{}".format(instance.user_id, cur_time, filename)


class RecordVideo(TimeStampModel):
    video_url = models.FileField(upload_to=upload_to, default="posts/default")
    user_id = models.ForeignKey(
        User, on_delete=models.CASCADE, db_column="user_id", null=True
    )

    class Meta:
        db_table = "record_video"
