from haversine import haversine

from .models import SignCenter
from .serializers import CenterSerializer


def select_centers(queryset, lat, lng, cnt):
    '''
        사용자의 현재 위/경도에서 가까운 cnt개의 수어통역센터의 정보와 사용자와의 거리를 반환하는 함수
        latlng_dic: 센터 별 위/경도를 담는 dict
        distance_dic: 사용자-센터 간 거리를 담는 dict
    '''

    user_pos = (float(lat), float(lng))

    latlng_dic = dict()
    for q in queryset:
        latlng_dic[q.id] = (q.lat, q.lng)

    distance_dic = dict()
    for id, center_pos in latlng_dic.items():
        dist = haversine(user_pos, center_pos, unit='km')
        distance_dic[id] = dist

    # 거리가 가까운 순으로 정렬
    distance_dic = dict(sorted(distance_dic.items(), key=lambda x: x[1])[:cnt])

    centers = []
    for id, km in distance_dic.items():
        center = SignCenter.objects.get(id=id)
        center = CenterSerializer(center)  # center객체 직렬화.

        # distance를 추가하여 dict로 만든다
        x = dict(
            center_info=center.data,
            distance=km
        )
        centers.append(x)

    return centers
