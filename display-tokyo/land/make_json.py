import csv
from os import write
import json
import random

# 名前の意味情報を読み取る
with open('./meaning.csv') as f:
  reader = csv.reader(f)
  meaning = [row for row in reader]

# ヘッダー削除
meaning = meaning[1:]

json_list = []
dic = {}
    # {
    # "forename": "Aaron",
    # "sex": "m",
    # "births":

    # "forenameUnique": "Aaron",
    # "id": "aaron"
    # }

start_year = 1950
end_year = 2021

for mean in meaning:
    if mean[3] == "":
        continue
    dic_i = {}
    dic_i["forename"] = mean[3]
    dic_i["sex"] = "m" if random.uniform(0, 1) > 0.5 else "f" #適当に分けてみた
    dic_i["births"] = [0] * (end_year - start_year + 1) #とりあえず1950-2021で表示させてみる
    dic_i["forenameUnique"] = mean[3]
    dic_i["id"] = mean[3]

    dic[mean[0]] = dic_i

# 建物情報を読み取る
with open('./year_suumo_tokyo.csv') as f:
  reader = csv.reader(f)
  buiding = [row for row in reader]

# ヘッダー削除
buiding = buiding[1:]

for bill in buiding:
  name = bill[1]
  year = int(bill[2])
  for mean in meaning:
    if not mean[0] in dic.keys():
        continue

    if mean[0] in name: # 建物名にキーワードが含まれているか
      if start_year <= year <= end_year:
        dic[mean[0]]["births"][year - start_year] += 1

json_list = []
for v in dic.values():
    json_list.append(v)

with open("./forenames_suumo.json", "w") as outfile:
    json.dump(json_list, outfile)