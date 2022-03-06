import random


def extract_answer(question):
    '''
        quiz_answer : 퀴즈 정답
        quiz_name : 퀴즈 이름
        quiz_video : 퀴즈 비디오
        answer_id : 정답 id
        질문 객체에서 정보를 추출한다.
    '''
    quiz_answer = question.answer_id.description
    quiz_name = question.question
    quiz_video = question.video_id.video_url.name
    answer_id = question.answer_id_id

    return quiz_answer, quiz_name, quiz_video, answer_id


def extract_text(choice):
    '''
        지문 반환
    '''
    text = choice.description
    return text


def extract_text_list(description_obj, answer_id, quiz_answer):
    '''
        choie_list : 문제 지문 목록 반환
    '''
    choice_obj = description_obj.exclude(id=answer_id)
    # 정답을 제외한 지문 객체 생성.
    choice_list = []
    for choice in choice_obj:
        text = extract_text(choice)
        choice_list.append(text)
    choice_list = random.sample(choice_list, 2)
    # 정답을 제외한 지문에서 2개 뽑기
    choice_list.append(quiz_answer)
    # 마지막에 정답 지문 추가
    random.shuffle(choice_list)
    # 지문의 순서 변경
    return choice_list


def extract_quiz_list(question_obj, description_obj):
    '''
    quiz_list : 반환할 quiz 정보 모음
    '''
    quiz_list = []
    # 반환할 퀴즈 list
    for question in question_obj:
        quiz_dict = dict()
        quiz_answer, quiz_name, quiz_video, answer_id\
            = extract_answer(question)
        choice_list\
            = extract_text_list(description_obj, answer_id, quiz_answer)
        quiz_info = dict(
            answer=quiz_answer,
            choice_text=choice_list,
            video=quiz_video
        )
        quiz_dict[quiz_name] = quiz_info
        quiz_list.append(quiz_dict)
    return quiz_list
