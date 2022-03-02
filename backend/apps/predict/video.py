import os
from collections import deque
from datetime import datetime

import cv2
import mediapipe as mp
import numpy as np
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.models import Sequential
from tensorflow.keras.utils import to_categorical

labels = {
    "back": 0,
    "belly": 1,
    "bleeding": 2,
    "burn": 3,
    "chest": 4,
    "choke": 5,
    "colic": 6,
    "cut": 7,
    "dislocation": 8,
    "ear": 9,
    "faint": 10,
    "fever": 11,
    "fracture": 12,
    "hand": 13,
    "head": 14,
    "heart_attack": 15,
    "high_fever": 16,
    "inside_of_thigh": 17,
    "knee": 18,
    "left_eye": 19,
    "neck": 20,
    "nose": 21,
    "painkiller": 22,
    "right_eye": 23,
    "seizure": 24,
    "shortness_of_breath": 25,
    "shoulder": 26,
    "waist": 27,
    "whirl": 28,
    "wrist": 29,
}


actions = [
    "back",
    "belly",
    "bleeding",
    "burn",
    "chest",
    "choke",
    "colic",
    "cut",
    "dislocation",
    "ear",
    "faint",
    "fever",
    "fracture",
    "hand",
    "head",
    "heart_attack",
    "high_fever",
    "inside_of_thigh",
    "knee",
    "left_eye",
    "neck",
    "nose",
    "painkiller",
    "right_eye",
    "seizure",
    "shortness_of_breath",
    "shoulder",
    "waist",
    "whirl",
    "wrist",
]


def video_resolution(video_name):
    video_url = os.path.join("backend/media/", video_name)
    cap = cv2.VideoCapture(video_url)

    fourcc = cv2.VideoWriter_fourcc(*"XVID")

    output_name = video_name.split(".")[0]
    output = f"{output_name}.avi"

    out = cv2.VideoWriter(
        os.path.join("backend/media/", output), fourcc, 30, (1280, 720)
    )

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
    filename = filename.split(".")[0]
    filename = f"{filename}.mp4"
    cur_time = str(datetime.today().strftime("%Y-%m-%d_%H-%M-%S"))
    video_name = "recorded/{}/{}/{}".format(instance.user_id, cur_time, filename)
    return video_name


# mediapipe 감지 함수
def mediapipe_detection(image, model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # COLOR CONVERSION BGR 2 RGB
    image.flags.writeable = False  # Image is no longer writeable
    results = model.process(image)  # Make prediction
    image.flags.writeable = True  # Image is now writeable
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # COLOR COVERSION RGB 2 BGR
    return image, results


# keypoints 추출 함수
def extract_keypoints(results):
    pose = (
        np.array(
            [
                [res.x, res.y, res.z, res.visibility]
                for res in results.pose_landmarks.landmark
            ]
        ).flatten()
        if results.pose_landmarks
        else np.zeros(33 * 4)
    )  # member : x,y,z,visibility

    face = (
        np.array(
            [[res.x, res.y, res.z] for res in results.face_landmarks.landmark]
        ).flatten()
        if results.face_landmarks
        else np.zeros(468 * 3)
    )  # member : x,y,z

    lh = (
        np.array(
            [[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]
        ).flatten()
        if results.left_hand_landmarks
        else np.zeros(21 * 3)
    )  # member : x,y,z

    rh = (
        np.array(
            [[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]
        ).flatten()
        if results.right_hand_landmarks
        else np.zeros(21 * 3)
    )  # member : x,y,z
    return np.concatenate([pose, face, lh, rh])


def make_model():

    output = np.array(actions)

    model = Sequential()
    model.add(
        LSTM(64, return_sequences=True, activation="tanh", input_shape=(60, 1662))
    )  # (frame , keypoints)
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

    model.load_weights(os.environ.get("MODEL_NAME"))

    return model


def keypoints_labeling(video):

    cap = cv2.VideoCapture(video)
    # 프레임 추출

    mp_holistic = mp.solutions.holistic
    # mediapipe model

    keypoints_data = []
    # 추출할 keypoints 데이터

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

    predict_data = []
    # 예측에 사용할 데이터

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


def predict_score(video_url, user_sign):
    video = "backend" + video_url

    """
        영상의 keypoints 추출
        slide labeling을 이용하여
        model에 들어갈 데이터의 input_shape를 맞춰 줌.
    """
    predict_data = keypoints_labeling(video)

    if predict_data:
        predict_value = np.array(predict_data)

        """
            예측
        """
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

    else:
        return False
