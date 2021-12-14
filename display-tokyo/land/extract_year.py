import pandas as pd
from pandas import Series

df = pd.read_csv('suumo_tokyo.csv',encoding='utf-8')

year = []
for i in range(len(df)):
    txt = df["year"][i]

    if txt.find("年") != -1:
        pos = txt.find("年")
        txt = txt[:pos]
    else:
        print("unknown string:")
        print(txt)
        txt = 0

    year.append(txt)

year = Series(year)
year_df = pd.concat([df["name"], year], axis=1)
year_df.columns = ["name", "year"]

year_df.to_csv("year_suumo_tokyo.csv", encoding="utf-8")
