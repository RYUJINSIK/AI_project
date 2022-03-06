import csv
import os
import sys
from pathlib import Path

import django
import dotenv
from apps.quiz.models import QuizCollection, QuizDescription, QuizQuestion
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

# 문제: 이러면 테이블에 id가 1부터 시작안하고 계속 증가함. (아예 테이블을 버리고 하는 방법이 있어야할듯)
QuizQuestion.objects.all().delete()

CSV_PATH_PRODUCTS = 'quiz_question.csv'

with open(CSV_PATH_PRODUCTS, encoding='utf8') as in_file:
    data_reader = csv.DictReader(in_file)
    for row in data_reader:
        collection_id = row['collection_id']
        answer_id = row['answer_id']
        video_id = row['video_id']
        collection = QuizCollection.objects.get(id=collection_id)
        answer = QuizDescription.objects.get(id=answer_id)
        video = LearningVideo.objects.get(id=video_id)
        quiz = QuizQuestion(
                question=row['question'],
                collection_id=collection,
                answer_id=answer,
                video_id=video
                )
        quiz.save()
