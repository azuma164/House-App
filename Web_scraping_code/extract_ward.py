import pandas as pd
from pandas import Series

df = pd.read_csv('suumo_tokyo.csv',encoding='utf-8')

city = []
for i in range(len(df)):
    txt = df["address"][i]

    if txt.find("区") != -1:
        pos = txt.find("区")
        txt = txt[:pos+1]
    elif txt.find("市") != -1:
        pos = txt.find("市")
        txt = txt[:pos+1]
    elif txt.find("郡") != -1:
        pos = txt.find("郡")
        txt = txt[:pos+1]
    elif txt.find("町") != -1:
        pos = txt.find("町")
        txt = txt[:pos+1]
    else:
        print("unknown string:")
        print(txt)
    

    if txt.find("都") != -1:
        pos = txt.find("都")
        txt = txt[pos+1:]

    city.append(txt)

city = Series(city)
city_df = pd.concat([df["name"], city], axis=1)
city_df.columns = ["name", "city"]

city_df.to_csv("city_suumo_tokyo.csv", encoding="utf-8")
