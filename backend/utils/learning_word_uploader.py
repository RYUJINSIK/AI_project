import csv
import os
import sys
from pathlib import Path

import django
import dotenv
from apps.video.models import LearningVideo

sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(
                os.path.abspath(__file__)) + '/utils')))

BASE_DIR = Path(__file__).resolve().parent.parent
dotenv.read_dotenv(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")
django.setup()


LearningVideo.objects.all().delete()

CSV_PATH_PRODUCTS = 'learning_word.csv'

with open(CSV_PATH_PRODUCTS, encoding='utf8') as in_file:
    data_reader = csv.DictReader(in_file)
    for row in data_reader:
        video = LearningVideo(
            video_name=row['video_name'],
            korean_name=row['korean_name'],
            video_url=row['video_url'],
            category=row['category'],
            difficulty=row['difficulty'],
            image_url=row['image_url']
        )
        video.save()
