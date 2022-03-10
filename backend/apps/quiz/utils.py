import random


def extract_answer(question):
    '''
        퀴즈 객체에서 정보를 추출하는 함수
        quiz_answer : 퀴즈 정답
        quiz_video : 퀴즈 비디오
        answer_id : 정답 id
    '''

    quiz_answer = question.answer_id.korean_name
    quiz_video = question.video_id.video_url.name
    answer_id = question.answer_id_id

    return quiz_answer, quiz_video, answer_id


def extract_text(choice):
    '''
        보기를 반환하는 함수
    '''

    text = choice.korean_name
    return text


def extract_text_list(description_obj, answer_id, quiz_answer):
    '''
        퀴즈의 보기 목록을 반환하는 함수
    '''

    choice_obj = description_obj.exclude(id=answer_id)  # 정답을 제외한 보기 객체 생성.
    choice_list = []
    # 보기 리스트(choice_list)에 보기(text)를 추가하기
    for choice in choice_obj:
        text = extract_text(choice)
        choice_list.append(text)
    choice_list = random.sample(choice_list, 2)  # 정답을 제외한 보기에서 2개 뽑기
    choice_list.append(quiz_answer)
    random.shuffle(choice_list)
    return choice_list


def extract_quiz_list(question_obj, description_obj):
    '''
        퀴즈 정보를 반환하는 함수
        quiz_list : quiz 정보 모음
    '''

    quiz_list = []

    for question in question_obj:
        quiz_answer, quiz_video, answer_id\
            = extract_answer(question)
        choice_list\
            = extract_text_list(description_obj, answer_id, quiz_answer)
        quiz_info = dict(
            answer=quiz_answer,
            choice_text=choice_list,
            video=quiz_video
        )
        quiz_list.append(quiz_info)
    random.shuffle(quiz_list)                        # 문제 순서 섞기
    return quiz_list
