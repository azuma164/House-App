import pandas as pd
import regex

df = pd.read_csv('suumo_tokyo.csv',encoding='utf-8')

p = regex.compile(r'[\p{Script=Katakana}ー]+')
df['kana'] = ""
dict = {}
for i in range(len(df)):
    kana_list = p.findall(df['name'][i])
    for kana in kana_list:
        if kana in dict.keys():
            dict[kana] += 1
        else:
            dict[kana] = 1
    #df['kana'][i].extend(kana_list)
    if len(kana_list) > 0:
        df['kana'][i] = kana_list[0]
print(sorted(dict.items(), key=lambda x: x[1]))