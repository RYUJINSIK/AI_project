import csv
import os

import django
import dotenv

dotenv.read_dotenv()
# sys.path.append('C:\\Elice\\ai\\my\\project-template')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local") # django 프로젝트의 settings 파일의 위치를 지정.
django.setup()

from apps.map.models import Center  # django.setup() 이후에 임포트해야 오류가 나지 않음

# 문제: 이러면 테이블에 id가 1부터 시작안하고 계속 증가함. (아예 테이블을 버리고 하는 방법이 있어야할듯)
center = Center.objects.all().delete()

CSV_PATH_PRODUCTS= os.path.join(os.path.abspath((os.path.dirname(__file__))), 'center.csv') 

with open(CSV_PATH_PRODUCTS, encoding='utf8') as in_file:
    data_reader = csv.DictReader(in_file)
    # next(data_reader, None)        # 출력시 함께 출력되는 맨첫줄을 제외하고 출력하기 위함
    for row in data_reader:
        center = Center(
                name=row['name'],
                location=row['location'],
                voice_call=row['voice_call'],
                video_call=row['video_call'],
                lat=row['lat'],
                lng=row['lng']
                )
        center.save()
