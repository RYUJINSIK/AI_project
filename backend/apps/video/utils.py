def upload_to(instance, filename):
    '''
        return 이후에 백엔드에 파일이 생성된다.
        instance는 Learning_Video객체이다.
        instance.video_name은 video를 식별할 수 있는 이름
    '''

    return "static/education/{}/{}".format(instance.video_name, filename)