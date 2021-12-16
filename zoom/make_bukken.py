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

for bill in buiding:
  for key in dic.keys():
    if dic_name[key] in bill[1]: # 建物名にキーワードが含まれているか
        dic[key].append(bill[1])

name = []
billdings = []

for key in dic.keys():
    for bill in dic[key]:
        name.append(key)
        billdings.append(bill)

name = pd.Series(name)
billdings = pd.Series(billdings)

df = pd.concat([name, billdings], axis=1)
df.columns = ["alphabet", "name"]

with codecs.open("./files/alphabet_to_housename", "w") as outfile:
    json.dump(dic, outfile, indent=1)

df.to_csv("./files/alphabet_to_housename.csv", encoding='utf-8')