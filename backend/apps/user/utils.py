import copy

from django.http import QueryDict


def medal_score(score):
    '''
        점수에 따른 메달 계산
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
        객체 업데이트
        query_obj_list : QueryDict 객체 모음
    '''
    request_data = copy.deepcopy(request_data)
    for query_obj in query_obj_list:
        request_data.update(query_obj)
    return request_data
