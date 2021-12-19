import csv

with open('./meaning.csv') as f:
  reader = csv.reader(f)
  meaning = [row for row in reader]

meaning = meaning[1:]

for i in range(len(meaning) - 1):
    if meaning[i][3] == meaning[i + 1][3]:
        if meaning[i][3] == "":
            continue
        print(meaning[i][0])