import pandas as pd
import csv

df = pd.read_csv("language_boolean.csv", encoding="utf-8")

dic = {}
for i in range(len(df)):
    city = df["city"][i]
    if city in dic.keys():
        dic[city]["en"] += df["en"][i]
        dic[city]["fr"] += df["fr"][i]
        dic[city]["sp"] += df["sp"][i]
        dic[city]["ge"] += df["ge"][i]
        dic[city]["it"] += df["it"][i]
        dic[city]["la"] += df["la"][i]
        dic[city]["gr"] += df["gr"][i]
        dic[city]["ru"] += df["ru"][i]
        dic[city]["po"] += df["po"][i]
        dic[city]["ja"] += df["ja"][i]
    else:
        dic[city] = {}
        dic[city]["en"] = df["en"][i]
        dic[city]["fr"] = df["fr"][i]
        dic[city]["sp"] = df["sp"][i]
        dic[city]["ge"] = df["ge"][i]
        dic[city]["it"] = df["it"][i]
        dic[city]["la"] = df["la"][i]
        dic[city]["gr"] = df["gr"][i]
        dic[city]["ru"] = df["ru"][i]
        dic[city]["po"] = df["po"][i]
        dic[city]["ja"] = df["ja"][i]

list = []
for d in dic.keys():
    list_d = [d]
    for v in dic[d].values():
        list_d.append(v)
    list.append(list_d)

with open('./city_language.csv', 'w') as f:
  writer = csv.writer(f)
  # csvのヘッダーの書き込み
  writer.writerow(['city', 'en','fr','sp','ge','it','la','gr','ru','po','ja'])
  writer.writerows(list)
  # マンションが存在しない地域の書き込み
  writer.writerow(['檜原村',0,0,0,0,0,0,0,0,0,0])
  writer.writerow(['日の出町',0,0,0,0,0,0,0,0,0,0])
  writer.writerow(['所属未定地',0,0,0,0,0,0,0,0,0,0])