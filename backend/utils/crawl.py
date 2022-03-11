import pandas as pd
import requests
from bs4 import BeautifulSoup

# 가져올 url 정해지면, 거기에 html을 가져오고 읽은 후, 분석하여 원하는것만 결과를 보거나 저장

url = 'http://17nsl.com/franchise/list'
html = requests.get(url).content
soup = BeautifulSoup(html, 'html.parser')

querys = []
for i in range(1, 18):
    area = soup.find(class_=f'icon{i}').text
    querys.append(area)


name, address, voice, video = [], [], [], []
result = []

for query in querys:    # for query in querys
    for page in range(1, 5):
        url = f'http://17nsl.com/franchise/list?wm_area={query}&wm_area2=&wm_area2&text=&page={page}'
        html = requests.get(url).content
        soup = BeautifulSoup(html, 'html.parser')

    for n in soup.select('.mo-hidden + td'):
        name.append(n.text)
        # print(len(name), name)

    for a in soup.find_all(class_='tal'):
        address.append(a.text)
        # print(len(address), address)

    for p in soup.select('.tal + td'):
        p = p.text
        if ' ' not in p and p.startswith('전'):
            p = p.strip('전화')
            voice.append(p)
            video.append(None)
        elif ' ' not in p and p.startswith('영'):
            p = p.strip('영통')
            video.append(p)
            voice.append(None)
        else:
            p = p.replace('전화', '').replace('영통','')
            v1, v2 = p.split()
            voice.append(v1)
            video.append(v2)
        # print(len(voice), voice)
        # print(len(video), video)

for i in range(len(name)):
    result.append([name[i], address[i], voice[i], video[i]])

result = pd.DataFrame(result)
result.columns = ['name', 'location', 'voice_call', 'video_call']

result.to_csv('center.csv')
