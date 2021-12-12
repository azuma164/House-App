# あらかじめ、各語の使用回数を数えあげて、csvに保存しておく。

import csv

words, buildings = [], []

with open('data/city_suumo_tokyo.csv') as f:
    buildings_data = csv.DictReader(f)
    buildings = [row for row in buildings_data]
with open('data/meaning.csv') as ff:
    words_data = csv.DictReader(ff)
    words = [row for row in words_data]

# 出現回数をカウントする
for word in words:
    word["count"] = 0
    for building in buildings:
        if word["name"] in building["name"]:
            word["count"] += 1



# 保存
labels = ["name","言語コード","意味","綴り","count"]
try:
    with open('data/words_count.csv', 'w') as f:
        writer = csv.DictWriter(f, fieldnames=labels)
        writer.writeheader()
        for elem in words:
            writer.writerow(elem)
except IOError:
    print("I/O error")