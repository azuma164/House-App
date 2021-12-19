import json
import csv

dic = {}
dic["name"] = "flare"

dic_list = [{} for i in range(14)] 
dic_list[0]["name"] = "Valuable"
dic_list[1]["name"] = "Name"
dic_list[2]["name"] = "Sacred"
dic_list[3]["name"] = "Topography"
dic_list[4]["name"] = "Animals & Plants"
dic_list[5]["name"] = "Abstraction"
dic_list[6]["name"] = "People"
dic_list[7]["name"] = "Excellent & Beauty"
dic_list[8]["name"] = "House"
dic_list[9]["name"] = "Nature"
dic_list[10]["name"] = "City"
dic_list[11]["name"] = "Familiar"
dic_list[12]["name"] = "Daily life"
dic_list[13]["name"] = "Prime"

# 名前の意味情報を読み取る
with open('./meaning.csv') as f:
  reader = csv.reader(f)
  meaning = [row for row in reader]

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
    if not "children" in dic_list[category].keys():
        dic_list[category]["children"] = []
    dic_i = {"name": mean[3], "value": 1}
    dic_list[category]["children"].append(dic_i)

dic["children"] = dic_list

print(dic_list)

with open("./files/categoryfile", "w") as outfile:
    json.dump(dic, outfile, indent=1)