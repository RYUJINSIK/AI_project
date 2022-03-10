# Generated by Django 4.0.2 on 2022-03-02 11:07

import apps.video.utils
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='LearningVideo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('video_name', models.CharField(max_length=50)),
                ('korean_name', models.CharField(max_length=50)),
                ('video_url', models.FileField(default='learning/default', upload_to=apps.video.utils.upload_to)),
                ('category', models.CharField(choices=[('B', '신체'), ('S', '질환')], max_length=1)),
                ('difficulty', models.CharField(choices=[('L', '하'), ('M', '중'), ('H', '상')], max_length=1)),
            ],
            options={
                'db_table': 'learning_video',
            },
        ),
    ]
