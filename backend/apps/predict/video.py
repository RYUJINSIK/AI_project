import os
from datetime import datetime

import cv2
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import numpy as np
import mediapipe as mp
from collections import deque

words = {
        "귀": "ear", "가슴": "chest", "허리": "waist", 
        "등": "back", "머리": "head", "목":"neck", "무릎":"knee",
        "복부":"belly", "복통":"colic","손":"hand",
        "손목":"wrist", "어깨":"shoulder", "오른쪽-눈":"right_eye",
        "왼쪽-눈":"left_eye", "코":"nose", "허벅지":"inside_of_thigh",
        "고열":"high_fever","골절": "Fracture","화상":"burn",
        "진통제":"painkiller", "자상":"cut", "열":"fever",
        "질식":"choke","출혈":"bleeding", "탈골":"dislocation",
        "발작":"seizure","기절":"faint","호흡곤란":"shortness of breath",
        "어지러움":"whirl","심장마비":"heart_attack"
}

actions = [
            'back','belly','bleeding','burn','chest','choke',
            'colic','cut','dislocation','ear','faint','fever','fracture',
            'hand','head','heart_attack','high_fever','inside_of_thigh','knee',
            'left_eye','neck','nose','painkiller','right_eye','seizure',
            'shortness_of_breath','shoulder','waist','whirl','wrist'
        ]

def video_resolution(video_name):
    video_url = os.path.join("backend/media/", video_name)
    cap = cv2.VideoCapture(video_url)

    fourcc = cv2.VideoWriter_fourcc(*"XVID")

    output_name = video_name.split(".")[0]
    output = f"{output_name}.avi"

    out = cv2.VideoWriter(os.path.join("backend/media/", output), fourcc, 30, (1280, 720))

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

# mediapipe 감지 함수
def mediapipe_detection(image,model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) # COLOR CONVERSION BGR 2 RGB
    image.flags.writeable = False                  # Image is no longer writeable
    results = model.process(image)                 # Make prediction
    image.flags.writeable = True                   # Image is now writeable
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR) # COLOR COVERSION RGB 2 BGR
    return image, results


# keypoints 추출 함수
def extract_keypoints(results):
    # pose의 landmark 배열을 일차원으로 펴서 반환한다. pose landmark가 없을 시 동일한 shape를 가진 영행렬을 반환한다.
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33 * 4) # member : x,y,z,visibility

    # face의 landmark 배열을 일차원으로 펴서 반환. face landmark가 없을 시 동일한 shape를 가진 영행렬을 반환한다.
    face = np.array([[res.x, res.y, res.z] for res in results.face_landmarks.landmark]).flatten() if results.face_landmarks else np.zeros(468 * 3) # member : x,y,z

    # 왼손 랜드마크 배열 left_hand_landmarks가 없을 경우에는 동일한 shape의 영행렬을 반환한다.
    lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21 * 3) # member : x,y,z

    # 오른손 랜드마크 배열 left_hand_landmarks가 없을 경우에는 동일한 shape의 영행렬을 반환한다.
    rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21*3) # member : x,y,z
    return np.concatenate([pose, face, lh, rh])


def make_model():

    output = np.array(actions)

    model = Sequential()
    model.add(LSTM(64, return_sequences=True, activation='tanh', input_shape=(60,1662))) # (frame , keypoints)
    model.add(LSTM(128, return_sequences=True, activation='tanh'))
    model.add(LSTM(64, return_sequences=False, activation='tanh'))
    model.add(Dense(64, activation='tanh'))
    model.add(Dense(32, activation='tanh'))
    model.add(Dense(output.shape[0], activation='softmax'))

    model.compile(
        optimizer='adam', 
        loss='categorical_crossentropy',
        metrics=['categorical_accuracy']
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

    with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        
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

    print(f'keypoints_data : {len(keypoints_data)}')

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
    # 영상의 경로

    '''
        영상의 keypoints 추출
    '''
    # 영상의 프레임이 60이하면 라벨링이 불가능함.
    
    '''
        slide labeling을 이용하여
        model에 들어갈 데이터의 input_shape를 맞춰 줌.
    '''
    predict_data = keypoints_labeling(video)

    if predict_data:
        predict_value = np.array(predict_data)

        '''
            예측
        '''
        model = make_model()

        predict_result = model.predict(predict_value)
        
        predict_list = []
        for predict in predict_result:
            print(f'예측 결과 : {actions[np.argmax(predict)]}')
            print(f'예측 인덱스 :{np.argmax(predict)} ')
            predict_list.append(int(np.argmax(predict)))

        value = max(predict_list, key = predict_list.count)
        print(f'최빈 값 : {actions[value]}')
        print(f"개수 : {predict_list.count(value)}")
        print(f'길이: {len(predict_list)}' )
        accuracy = predict_list.count(value) / len(predict_list)
        accuracy = round(accuracy,2) * 100

        return accuracy

    else:
        return False
    
