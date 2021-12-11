import csv
from os import write

# 名前の意味情報を読み取る
with open('./meaning.csv') as f:
  reader = csv.reader(f)
  meaning = [row for row in reader]

# ヘッダー削除
meaning = meaning[1:]

# 建物情報を読み取る
with open('./suumo_tokyo.csv') as f:
  reader = csv.reader(f)
  buiding = [row for row in reader]

# ヘッダー削除
buiding = buiding[1:]

buiding_and_language = []
# 建物名、場所、英語、フランス語、スペイン語、ドイツ語、イタリア語、ラテン語、ギリシャ語、ロシア語、ボルトガル語、日本語
for bill in buiding:
  # 後で書き込むようの配列を作っておく
  # 最初はそれぞれの建物名に全ての言語が含まれていないとする
  row = [bill[1], bill[2]] + [0]*10
  for mean in meaning:
    if mean[0] in bill[1]: # 建物名にキーワードが含まれているか
      # 英語
      if mean[1] == 'en':
        row[2] = 1
      # フランス語
      if mean[1] == 'fr':
        row[3] = 1
      # スペイン語
      if mean[1] == 'es':
        row[4] = 1
      # ドイツ語
      if mean[1] == 'de' or mean[1] == 'ge':
        row[5] = 1
      # イタリア語
      if mean[1] == 'ru' or mean[1] == 'it':
        row[6] = 1
      # ラテン語
      if mean[1] == 'la':
        row[7] = 1
      # ギリシャ語
      if mean[1] == 'el':
        row[8] = 1
      # ロシア語
      if mean[1] == 'ru':
        row[9] = 1
      # ポルトガル語
      if mean[1] == 'pt':
        row[10] = 1
      # 日本語
      if mean[1] == 'ja':
        row[11] = 1
  # 建物ごとに言語booleanの配列を作り、全体としては二次元配列にする
  buiding_and_language.append(row)

# print(buiding_and_language)

with open('./language_boolean.csv', 'w') as f:
  writer = csv.writer(f)
  # csvのヘッダーの書き込み
  writer.writerow(['建物名', '場所', '英語','フランス語','スペイン語','ドイツ語','イタリア語','ラテン語','ギリシャ語','ロシア語','ボルトガル語','日本語'])
  writer.writerows(buiding_and_language)