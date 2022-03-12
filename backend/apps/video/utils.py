import random as rand

def upload_to(instance, filename):
    '''
        return 이후에 백엔드에 파일이 생성된다.
        instance는 Learning_Video객체이다.
        instance.video_name은 video를 식별할 수 있는 이름
    '''

    return "static/education/{}/{}".format(instance.video_name, filename)

def random_num(id):
    '''
        랜덤으로 id를 제외한 6개 숫자 뽑는 함수
    '''

    word_id = []

    while len(word_id) < 6:
        num = rand.randint(1, 30)
        if num not in word_id and num != id:
            word_id.append(num)

    return word_id