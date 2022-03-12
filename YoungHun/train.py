import cv2
import numpy as np
import os
import mediapipe as mp

import tensorflow as tf
from tensorflow.python.client import device_lib

from tensorflow.keras.utils import to_categorical
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.callbacks import TensorBoard # 로깅

'''
    Confusion Matrix를 통한 정확도 검증
'''
from sklearn.metrics import multilabel_confusion_matrix, accuracy_score
from sklearn.model_selection import train_test_split

mp_holistic = mp.solutions.holistic # Holistic model
mp_drawing = mp.solutions.drawing_utils # Drawing utilities

# mediapipe 감지 함수
def mediapipe_detection(image,model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) # COLOR CONVERSION BGR 2 RGB
    image.flags.writeable = False                  # Image is no longer writeable
    results = model.process(image)                 # Make prediction
    image.flags.writeable = True                   # Image is now writeable
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR) # COLOR COVERSION RGB 2 BGR
    return image, results


# landmark 특징점 그리는 함수
def draw_landmarks(image, results):
    mp_drawing.draw_landmarks(image, results.face_landmarks, mp_holistic.FACEMESH_TESSELATION) # Draw face connections
    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS) # Draw pose connections
    mp_drawing.draw_landmarks(image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS) # Draw left hand connections
    mp_drawing.draw_landmarks(image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS) # Draw right hand connections


# landmark 특징점의 선 굵기나, 색상을 변경하는 함수.
def draw_styled_landmarks(image, results):
    # Draw face connections
    mp_drawing.draw_landmarks(image, results.face_landmarks, mp_holistic.FACEMESH_TESSELATION,
                                # 색상 변경. 선의 굵기나, 색상을 변경한다.
                                mp_drawing.DrawingSpec(color=(80,110,10), thickness=1, circle_radius=1),
                                mp_drawing.DrawingSpec(color=(80,256,121), thickness=1, circle_radius=1)
                            ) 

    # Draw pose connections
    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS,
                                # 색상 변경. 선의 굵기나, 색상을 변경한다.
                                mp_drawing.DrawingSpec(color=(80,22,10), thickness=2, circle_radius=4),
                                mp_drawing.DrawingSpec(color=(80,44,121), thickness=2, circle_radius=2)
    )

    # Draw left hand connections
    mp_drawing.draw_landmarks(image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
                                # 색상 변경. 선의 굵기나, 색상을 변경한다.
                                mp_drawing.DrawingSpec(color=(121, 22, 76), thickness=2, circle_radius=4),
                                mp_drawing.DrawingSpec(color=(121, 44, 250), thickness=2, circle_radius=2)
    ) 

    # Draw right hand connections
    mp_drawing.draw_landmarks(image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
                                # 색상 변경. 선의 굵기나, 색상을 변경한다.
                                mp_drawing.DrawingSpec(color=(245 ,117, 66), thickness=2, circle_radius=4),
                                mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2)
    ) 


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

actions = sorted(os.listdir('Body_Sign_Data'))

# 추출할 numpy array 타입의 데이터 PATH
DATA_PATH = os.path.join("Body_Sign_Data")

# 특정 행동 들을 감지하려는 작업 (hello, thanks, iloveyou)
actions = np.array(actions)

# 비디오 숫자.
no_sequences = 240

# 비디오 내의 전체 프레임
sequence_length = 60

# actions 단어들에 labeling
label_map = {label:num for num, label in enumerate(actions)}

from collections import deque
# sequences, labels 배열
sequences, labels = [], [] 

for action in actions:
    # 각 영상 마다.(이 예제에서는 240)
    for sequence in range(no_sequences):
        
        data_path = os.path.join(DATA_PATH, action, str(sequence))
        length = len(os.listdir(data_path))
        res = [np.load(os.path.join(data_path,f'{i}.npy')) for i in range(length)]
        # 해당 numpy 배열을 window 배열에 추가한다.
        window = deque(res[:60])
        frame_length = len(res) // 60
        
        flag = 0
        for i in range(60, len(res)):
            if flag % frame_length == 0:
                sequences.append(list(window))
                labels.append(label_map[action])
            window.popleft()
            window.append(res[i])
            flag += 1


seq_length = [] 
for i in range(len(actions)):
    seq_length.append(labels.count(i))

train_seq = []
train_label = []
last_length = 0
import random
for length in seq_length:
    check_label = labels[last_length:length+last_length]
    train_seq += random.sample(sequences[last_length:length+last_length], 50)
    train_label += check_label[:50]
    print(f'prev_length : {last_length}')
    print(f'last_length : {length+last_length}')
    print(f'check_label : {check_label[-1]}')
    last_length += length


X = np.array(train_seq)
y = to_categorical(train_label).astype(int)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2)
'''
    LSTM Neural network
'''
model = Sequential()
model.add(LSTM(64, return_sequences=True, activation='tanh', input_shape=(60,1662))) # (frame , keypoints)
model.add(LSTM(128, return_sequences=True, activation='tanh'))
model.add(LSTM(64, return_sequences=False, activation='tanh'))
model.add(Dense(64, activation='tanh'))
model.add(Dense(32, activation='tanh'))
model.add(Dense(actions.shape[0], activation='softmax'))


'''
    Logs\train 폴더에 들어간뒤
    tensorboard --logdir=. 을 입력하면 
    Tensorbaord화면이 나온다.
    ex) 
    1step. cd suhwa_dataset\Logs\train
    2step. tesorboard --logdir=.
'''
log_dir = os.path.join('Logs')
tb_callback = TensorBoard(log_dir=log_dir)


'''
다중 클래스 분류 시 일반적인 손실함수 : categorical_crossentropy
다중 클래스 분류 시 일반적인 정확도 측정 함수 : categorical_accuracy
'''
model.compile(
    optimizer='adam', 
    loss='categorical_crossentropy',
    metrics=['categorical_accuracy']
)

# model check point && callback function
cb_chkpnt = tf.keras.callbacks.ModelCheckpoint(filepath = "./pose-sign-{epoch:04d}.h5", 
                                             monitor = "val_loss",
                                             mode = "auto",  
                                             verbose = 1, 
                                             save_best_only = True,
                                             save_weights_only = False,
                                             save_freq = "epoch")

cb_earlystop = tf.keras.callbacks.EarlyStopping( monitor = 'val_loss' , 
                                                 mode = "auto",
                                                 verbose = 1,
                                                 patience = 20)

with tf.device("/device:GPU:0"):
    model.fit(
        X_train, y_train,
        epochs=1000, 
        batch_size=64,
        validation_split=0.2, # 검증 데이터 나누기. => 이거 사용하면 sklearn train_test_split 사용 안해도됨.
        shuffle=True,
        verbose=1,
        callbacks=[cb_earlystop, cb_chkpnt]
        )


model.save('multi_pose.h5')                                            