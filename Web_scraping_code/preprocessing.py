import pandas as pd
import regex

df = pd.read_csv('suumo_adachi.csv', sep = '\t',encoding='utf-16')

p = regex.compile(r'[\p{Script=Katakana}ー]+')
#print(p.fullmatch(df['マンション名'].str))
# <regex.Match object; span=(0, 10), match='あーいアイウabc🈀'>
for i in range(256):
    print(i)
    print(p.findall(df['マンション名'][i]))
    