import os
from datetime import datetime

import cv2


def video_resolution(video_name):
    print(f"video_name : {video_name}")
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
