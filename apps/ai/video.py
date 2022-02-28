import os
from datetime import datetime

import cv2


def video_resolution(video_name):
    video_url = os.path.join("media/", video_name)
    cap = cv2.VideoCapture(video_url)

    fourcc = cv2.VideoWriter_fourcc(*"XVID")

    output_name = video_name.split(".")[0]
    output = f"{output_name}.avi"

    out = cv2.VideoWriter(os.path.join("media/", output), fourcc, 30, (1280, 720))

    while True:
        ret, frame = cap.read()
        if ret:
            b = cv2.resize(
                frame, (1280, 720), fx=0, fy=0, interpolation=cv2.INTER_CUBIC
            )
            out.write(b)
        else:
            break

    cap.release()
    out.release()
    cv2.destroyAllWindows()

    return output


def upload_to(instance, filename):
    """
    return 이후에 백엔드에 파일이 생성된다.
    instance는 User Object 객체이다.
    instance.user_id => 조회한 user_id의 user_name 반환.
    """
    filename = f"{filename}.mp4"
    cur_time = str(datetime.today().strftime("%Y-%m-%d_%H-%M-%S"))
    video_name = "recorded/{}/{}/{}".format(instance.user_id, cur_time, filename)
    return video_name
