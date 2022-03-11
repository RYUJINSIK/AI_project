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

from apps.signcenter.models import SignCenter

# 문제: 이러면 테이블에 id가 1부터 시작안하고 계속 증가함. (아예 테이블을 버리고 하는 방법이 있어야할듯)
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
