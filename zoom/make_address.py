import json
import csv
import codecs
import pandas as pd

dic = {}

# 名前の意味情報を読み取る
with codecs.open('./meaning.csv', "r") as f:
  reader = csv.reader(f)
  meaning = [row for row in reader]

dic_name = {}

# ヘッダー削除
meaning = meaning[1:]

for mean in meaning:
    if mean[3] == "" or mean[4] == "":
        continue
    if mean[4] == "備考":
        continue
    category = int(mean[4]) - 1
    if category > 13 or category < 0:
        print(mean[0])
        print(category)
        continue
    if not mean[3] in dic.keys():
        dic[mean[3]] = [] # alphabet to bukken
    if not mean[3] in dic_name.keys():
        dic_name[mean[3]] = mean[0] #alphabet to katakana
 
# 建物情報を読み取る
with codecs.open('./suumo_tokyo.csv', "r") as f:
  reader = csv.reader(f)
  buiding = [row for row in reader]

# ヘッダー削除
buiding = buiding[1:]
i = 0
for bill in buiding:
  for key in dic.keys():
    if dic_name[key] in bill[1]: # 建物名にキーワードが含まれているか
        address = bill[2]
        if address.find("区") == -1:
          continue 
        address = address.replace("ケ", "ヶ")

        if address.find("余丁町") != -1:
          address = "東京都新宿区余丁町"
          dic[key].append(address)
        elif address.rfind("丁") != -1:
          pos = address.rfind("丁")
          address = address[:pos]
          dic[key].append(address)
        elif address.rfind("町") != -1:
          pos = address.rfind("町")
          address = address[:pos + 1]
          dic[key].append(address)      
        elif address.rfind("番") != -1:
          pos = address.rfind("番")
          address = address[:pos - 1]
          dic[key].append(address)         
        else:
          i += 1

with codecs.open("./alphabet_to_address.json", "w") as outfile:
    json.dump(dic, outfile, indent=1)

