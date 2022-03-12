import os
import subprocess
from collections import deque
from datetime import datetime

import cv2
import mediapipe as mp
import numpy as np
from tensorflow.python.keras.layers import LSTM, Dense
from tensorflow.python.keras.models import Sequential

from apps.user.models import MedalType

# actions : 모델이 사용하는 단어, labels : 모델 사용 단어 라벨링
from .predlabel import actions, labels


def video_resolution(video_name):
    '''
        ffmpeg가 설치되어 있어야 사용 가능.
        사용자 영상의 해상도, 확장자, frame을 변경하는 함수.
        해상도 : 1280 * 720
        초당 프레임 : 30 frame
        확장자 : .avi
    '''
    video_url = os.path.abspath(os.path.join("media", video_name))
    output_name = video_name.split('.webm')[0]
    output_url = f'{output_name}.avi'
    convert_url = os.path.abspath(os.path.join("media", output_url))

    # ffmpeg 명령어를 shell에서 실행한다.
    try:
        subprocess.run(
            f'ffmpeg -i {video_url} -vf "scale=1280*720" -r 30 {convert_url}', shell=True
        )
    except ValueError:
        return False
    return output_url


def upload_to(instance, filename):
    '''
        RecordVideo model의 영상경로 설정을 위한 함수
    '''

    filename = filename.split(".")[0]
    filename = f"{filename}.webm"
    cur_time = str(datetime.today().strftime("%Y-%m-%d_%H-%M-%S"))
    return "recorded/{}/{}/{}".format(instance.user_id, cur_time, filename)


def mediapipe_detection(image, model):
    '''
        사용자가 업로드한 영상의 mediapipe keypoints를 감지하는 함수
    '''
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # COLOR CONVERSION BGR 2RGB
    image.flags.writeable = False  # Image is no longer writeable
    results = model.process(image)  # Make prediction
    image.flags.writeable = True  # Image is now writeable
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # COLOR COVERSION RGB 2BGR
    return image, results


def extract_keypoints(results):
    '''
        사용자가 업로드 한 영상의 keypoints를 추출하는 함수
    '''

    # 얼굴을 제외한 상체에서 keypoints를 추출한 변수
    pose = (
        np.array(
            [
                [res.x, res.y, res.z, res.visibility]
                for res in results.pose_landmarks.landmark
            ]
        ).flatten()
        if results.pose_landmarks
        else np.zeros(33 * 4)
    )

    # 얼굴에서 keypoints를 추출한 변수
    face = (
        np.array(
            [[res.x, res.y, res.z] for res in results.face_landmarks.landmark]
        ).flatten()
        if results.face_landmarks
        else np.zeros(468 * 3)
    )

    # 왼쪽 손에서 keypoints를 추출한 변수
    lh = (
        np.array(
            [[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark] # noqa : E501
        ).flatten()
        if results.left_hand_landmarks
        else np.zeros(21 * 3)
    )

    # 오른쪽 손에서 keypoints를 추출한 변수
    rh = (
        np.array(
            [[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark] # noqa : E501
        ).flatten()
        if results.right_hand_landmarks
        else np.zeros(21 * 3)
    )
    return np.concatenate([pose, face, lh, rh])


def make_model():
    '''
        학습 모델을 생성하는 함수
    '''

    output = np.array(actions)

    model = Sequential()
    model.add(
        LSTM(64, return_sequences=True, activation="tanh", input_shape=(60, 1662),) # noqa : E501
    )
    model.add(LSTM(128, return_sequences=True, activation="tanh"))
    model.add(LSTM(64, return_sequences=False, activation="tanh"))
    model.add(Dense(64, activation="tanh"))
    model.add(Dense(32, activation="tanh"))
    model.add(Dense(output.shape[0], activation="softmax"))

    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["categorical_accuracy"],
    )

    # path = os.path.abspath(os.path.join('project-template/backend', os.environ.get("MODEL_NAME")))
    model.load_weights(os.environ.get("MODEL_NAME"))

    return model


def predict_check(video_url):
    '''
        사용자가 업로드한 영상에서 keypoints를 추출하고,
        추론에 필요한 길이의 영상인지를 확인하는 함수
    '''

    # video = os.path.abspath(os.path.join('project-template/backend', video_url))
    video = os.path.abspath(os.path.join('media', video_url))
    # video = os.path.abspath(video_url)

    cap = cv2.VideoCapture(video)  # 프레임 추출하는 함수 호출

    mp_holistic = mp.solutions.holistic  # mediapipe model 선언

    keypoints_data = []  # 추출할 keypoints 데이터를 담기 위한 변수

    with mp_holistic.Holistic(
        min_detection_confidence=0.5, min_tracking_confidence=0.5
    ) as holistic:

        while cap.isOpened():
            ret, frame = cap.read()

            if not ret:
                break

            image, results = mediapipe_detection(frame, holistic)
            keypoints = extract_keypoints(results)
            keypoints_data.append(keypoints)

    if len(keypoints_data) < 61:
        return False
    else:
        return keypoints_data


def keypoints_labeling(keypoints_data):
    '''
        사용자가 보낸 영상의 keypoints를 labeling하는 함수
    '''

    predict_data = []  # 예측에 사용할 데이터를 담기위한 변수

    window = deque(keypoints_data[:60])
    frame_length = len(keypoints_data) // 60

    flag = 0
    for i in range(60, len(keypoints_data)):
        if flag % frame_length == 0:
            predict_data.append(list(window))
        window.popleft()
        window.append(keypoints_data[i])
        flag += 1

    return predict_data


def predict_score(predict_data, user_sign):
    '''
        학습 모델이 예측한 점수를 알려주는 함수
        - logic
            threshold = 0.5
            => 예측 정확도가 최소 50%를 넘지 않으면 정확도 계산에 사용하지 않음.
            predict_list
            => 영상에서 뽑아낸 60frame 단위 예측 모음
            accuracy
            => round((사용자가 예측한 단어를 모델이 예측한 개수 / 전체 예측 길이),2) * 100
    '''

    predict_value = np.array(predict_data)

    model = make_model()

    predict_result = model.predict(predict_value)

    predict_list = []
    threshold = 0.5

    [
        predict_list.append(int(np.argmax(predict)))
        for predict in predict_result
        if max(predict) > threshold
    ]
    user_sign = labels[user_sign]
    user_pred = predict_list.count(user_sign)
    if user_pred == 0:
        return 0
    else:
        accuracy = user_pred / len(predict_list)
        accuracy = round(accuracy, 2) * 100

    return accuracy


def video_patch(video_obj):
    '''
        영상 해상도를 변환하는 함수
    '''

    video_name = video_obj.video_url.name
    video_name = video_resolution(str(video_name))
    if not video_name:
        raise ValueError
    video_obj.video_url = video_name
    video_obj.save()
    return True


def calc_medal(score):
    '''
        점수에 따른 메달 id를 반환
    '''
    if score >= 70:
        medal_id = 1
    elif score >= 50:
        medal_id = 2
    else:
        medal_id = 3
    return medal_id


def get_medal_name(score):
    '''
        점수 에 따른 medal_name을 반환하는 함수
    '''
    medal_id = calc_medal(score)
    medal_name = MedalType.objects.get(id__exact=medal_id).medal_name
    return medal_name
