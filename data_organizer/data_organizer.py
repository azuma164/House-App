# -*- coding: utf-8 -*-
'''
Crawlerから吐き出されたcsvファイルに処理を加え、別のcsvファイルとして出力する。

'''
import pandas as pd

data = pd.read_csv("input_data/sample_raw_data.csv",
                   encoding="utf-16", sep="\t")

data = data.drop_duplicates('マンション名', keep='first')

