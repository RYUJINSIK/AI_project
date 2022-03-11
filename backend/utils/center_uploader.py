from apps.signcenter.models import SignCenter
import csv
import os
import sys
from pathlib import Path

import django
import dotenv

sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(
                os.path.abspath(__file__)) + '/utils')))

BASE_DIR = Path(__file__).resolve().parent.parent
dotenv.read_dotenv(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")
django.setup()


SignCenter.objects.all().delete()

CSV_PATH_PRODUCTS = 'center.csv'

with open(CSV_PATH_PRODUCTS, encoding='utf8') as in_file:
    data_reader = csv.DictReader(in_file)
    for row in data_reader:
        center = SignCenter(
            center_name=row['name'],
            location=row['location'],
            phone_num=row['voice_call'],
            video_phone_num=row['video_call'],
            lat=row['lat'],
            lng=row['lng']
        )
        center.save()
