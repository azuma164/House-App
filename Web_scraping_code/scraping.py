from bs4 import BeautifulSoup
import requests
import pandas as pd
from pandas import Series, DataFrame
import time

name = []
address = []
year = []
material = []
height = []
room_num = []

for ind in range(2141):
  url = ''
  if ind == 0:
    url = 'https://db.self-in.com/prefecture/13.html'
  else:
    url = 'https://db.self-in.com/prefecture/13_{}.html'
    url = url.format(ind+1)

  #データ取得
  result = requests.get(url)
  c = result.content

  #HTMLを元に、オブジェクトを作る
  soup = BeautifulSoup(c, 'html.parser')

  body = soup.find('body')
  pages = body.find_all("h3",class_='name')
  addr = body.find_all("dl", class_="clearfix add")
  # print(addr)
  for ad in addr:
    address.append(ad.find("dd").text)
  # print(address)

  for page in pages:
    name.append(page.text)

  info = body.find_all("tr")
  info_c = []
  cnt = 0
  for i in info:
    if cnt % 2 == 1:
      info_c.append(i)
    cnt += 1
  td = []
  cnt = 0
  # for i in info:
  #   print(i.find_all("td"))
  # print(info)
  info_list = []
  info_text = []
  for i in info_c:
    i_list = i.find_all('td')
    stack = []
    # print(i_list[1])
    for j in i_list[1].find_all('p'):
      # print(j)
      stack.append(j.text)
    info_list.append(stack)
  # print(info_list)
  for i in info_list:
    # print(i[0])
    year.append(i[0])
    material.append(i[1])
    height.append(i[2])
    room_num.append(i[3])

name = Series(name)
address = Series(address)
year = Series(year)
material = Series(material)
height = Series(height)
room_num = Series(room_num)


#各シリーズをデータフレーム化
suumo_df = pd.concat([name, address, year, material, height, room_num], axis=1)

# #カラム名
suumo_df.columns=['name','address','year','material','height','room_num']

# #csvファイルとして保存
suumo_df.to_csv('suumo_tokyo.csv', sep = ',',encoding='utf-16')