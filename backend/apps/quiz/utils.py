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


def extract_quiz_list(question_obj, description_obj):
    '''
    extract_quiz_list : 반환할 quiz 정보 모음
    '''
    quiz_list = []
    # 반환할 퀴즈 list
    for question in question_obj:
        quiz_dict = dict()
        quiz_answer, quiz_name, quiz_video, answer_id\
            = extract_answer(question)
        choice_obj = description_obj.exclude(id=answer_id)
        choice_list = []
        for choice in choice_obj:
            text = extract_text(choice)
            choice_list.append(text)
        choice_list = random.sample(choice_list, 2)
        choice_list.append(quiz_answer)
        quiz_info = dict(
            answer=quiz_answer,
            choice_text=choice_list,
            video=quiz_video
        )
        quiz_dict[quiz_name] = quiz_info
        quiz_list.append(quiz_dict)
    return quiz_list
