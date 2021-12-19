import requests
from bs4 import BeautifulSoup
import time
import tqdm
import json
import codecs
import csv

URL = 'http://www.geocoding.jp/api/'


def coordinate(address):
    """
    addressに住所を指定すると緯度経度を返す。

    >>> coordinate('東京都文京区本郷7-3-1')
    ['35.712056', '139.762775']
    """
    payload = {'q': address}
    html = requests.get(URL, params=payload)
    soup = BeautifulSoup(html.content, "html.parser")
    if soup.find('error'):
        print(f"Invalid address submitted. {address}")
    latitude = soup.find('lat').string
    longitude = soup.find('lng').string
    return [latitude, longitude]


def coordinates(addresses, interval=2, progress=True):
    """
    addressesに住所リストを指定すると、緯度経度リストを返す。

    >>> coordinates(['東京都文京区本郷7-3-1', '東京都文京区湯島３丁目３０−１'], progress=False)
    [['35.712056', '139.762775'], ['35.707771', '139.768205']]
    """
    coordinates = []
    for address in addresses:
        point = coordinate(address)
        if point[0] == "0":
            point = coordinate(address)
        if point[0] == "0":
            continue
        coordinates.append(point)
        time.sleep(interval)
    return coordinates

# with open("alphabet_to_address.json", "r") as f:
#     json_load = json.load(f)

# dic = {}
# dic_name = {}
# for key in ["adel"]:
#     list = []
#     for v in json_load[key]:
#         if v not in dic.keys():
#             dic[v] = coordinate(v)
#         list.append(dic[v])
        
#     dic_name[key] = list

# print(dic)
# print(dic_name)

with codecs.open('./files/tokyo_points.csv', "r", 'utf-8') as f:
  reader = csv.reader(f)
  meaning = [row for row in reader]

dic_name = {}
# ヘッダー削除
meaning = meaning[1:]

for mean in meaning[:5]:
    ward = mean[1] + mean[3] + mean[5]
    dic_name[ward] = [mean[6], mean[7]]

print(dic_name)