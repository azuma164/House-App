import json
import pandas as pd

with open("address_to_point.json") as f:
    dic_point = json.load(f)

with open("alphabet_to_address.json") as f:
    dic_alpha = json.load(f)

dic = {}
i = 0
for key in dic_alpha.keys():
    dic[key] = []
    for add in dic_alpha[key]:
        if add in dic_point.keys():
            dic[key].append(dic_point[add])
        else:
            add = add[:len(add) - 1]
            if add in dic_point.keys():
                dic[key].append(dic_point[add])
            else:
                i += 1
    
print(i)

alpha = []
x = []
y = []
for key in dic.keys():
    for v in dic[key]:
        alpha.append(key)
        y.append(v[0])
        x.append(v[1])

alpha = pd.Series(alpha)
x = pd.Series(x)
y = pd.Series(y)

df = pd.concat([alpha, x, y], axis=1)
df.columns = ["alphabet", "x", "y"]
    
with open("files/alphabet_to_points.json", "w") as f:
    json.dump(dic, f, indent=1)

df.to_csv("./files/alphabet_to_points.csv", encoding='utf-8')