import csv
import os

import django
import dotenv

dotenv.read_dotenv()
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")
django.setup()

from apps.video.models import LearningVideo

# 문제: 이러면 테이블에 id가 1부터 시작안하고 계속 증가함. (아예 테이블을 버리고 하는 방법이 있어야할듯)
LearningVideo.objects.all().delete()

CSV_PATH_PRODUCTS= os.path.join(os.path.abspath((os.path.dirname(__file__))), 'learning_video.csv')

with open(CSV_PATH_PRODUCTS, encoding='utf8') as in_file:
    data_reader = csv.DictReader(in_file)
    for row in data_reader:
        video = LearningVideo(
                video_name=row['video_name'],
                korean_name=row['korean_name'],
                video_url=row['video_url'],
                category=row['category'],
                difficulty=row['difficulty']
                )
        video.save()
