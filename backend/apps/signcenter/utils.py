from haversine import haversine

from .models import SignCenter
from .serializers import CenterSerializer


def select_centers(queryset, lat, lng, cnt):
    user_pos = (float(lat), float(lng))

    '''key:센터id, value:센터 별(위도,경도)'''
    latlng_dic = dict()
    for q in queryset:
        latlng_dic[q.id] = (q.lat, q.lng)

    '''key:센터id, value:사용자-센터 간 거리'''
    distance = dict()
    for id, center_pos in latlng_dic.items():
        dist = haversine(user_pos, center_pos, unit='km')
        distance[id] = dist

    '''거리 오름차순으로 정렬'''
    distance = dict(sorted(distance.items(), key=lambda x: x[1])[:cnt])

    centers = []
    for id, km in distance.items():
        test_dic = dict()
        center = SignCenter.objects.get(id=id)
        center = CenterSerializer(center)  # center객체 직렬화 하고,
        x = dict(
            center_info=center.data,
            distance=km
        )  # distance를 추가하여 dict로 만든다
        centers.append(x)

    return centers
