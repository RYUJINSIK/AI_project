import copy

from django.http import QueryDict

from .models import LearningVideo, MedalType


def medal_score(score):
    '''
        점수에 맞는 메달을 반환하는 함수
    '''

    if score >= 70:
        medal_id = 1
    elif score >= 50:
        medal_id = 2
    else:
        medal_id = 3

    return QueryDict(f'medal_id={medal_id}')


def update_query_dict(request_data, query_obj_list):
    '''
        QueryDict 객체 업데이트 함수
        query_obj_list : QueryDict 객체 모음
    '''

    request_data = copy.deepcopy(request_data)
    for query_obj in query_obj_list:
        request_data.update(query_obj)
    return request_data


def response_mypage(learning_list):
    '''
        mypage에 보여줄 정보들을 반환하는 함수
    '''

    learning_rate = len(learning_list)
    word_list = []
    gold = silver = bronze = 0
    for learn in learning_list:
        if len(word_list) < 7:
            # 화면에 띄워줄 최근 학습 단어는 6개까지 띄워 줄 것.
            medal = MedalType.objects.filter(
                id=learn['medal_id']).values('medal_name')
            video_id = learn['learning_video_id']
            word = LearningVideo.objects.filter(
                id=video_id).values('video_name', 'korean_name',
                                    'image_url')
            word_list.append(
                            [
                                word[0]['video_name'],
                                word[0]['korean_name'], word[0]['image_url'],
                                medal[0]['medal_name'], learn['score']
                            ]
                        )

        if learn['medal_id'] == 1:
            gold += 1
        elif learn['medal_id'] == 2:
            silver += 1
        else:
            bronze += 1

    return learning_rate, gold, silver, bronze, word_list
