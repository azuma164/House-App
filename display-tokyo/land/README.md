# Data of Japan
## 行政区分

* resions.csv

日本の地域。法律上の明確な定義はないものの慣習的に使用される分類を採用しています。
idはprefectures.csvのregionsと対応しています。

* prefectures.csv

全国地方公共団体コード( http://www.soumu.go.jp/denshijiti/code.html )として規定されているもののうち都道府県コードをデータ化。
JIS X 0401として規定されているほか、ISO 3166-2にも番号は引き継がれています。

* prefecturalCapital.csv
都道府県庁の所在する緯度と経度。各都道府県庁ウェブサイトに記載の住所を、Geocoding.jp( http://www.geocoding.jp/ )を用いて緯度経度を算出した。作業日は2014年7月1日。

* japan.geojson、japan.topojson

地球地図日本( http://www.gsi.go.jp/kankyochiri/gm_jpn.html )に掲載されているShapefileを変換し、ジオメトリー以外のデータとして、都道府県名（日本語と英語表記）とID(prefectures.csvで使用しているもの)を付加したファイルで、都道府県ごとに境がある日本地図。前者がGeoJSON、後者がTopoJSONで内容自体は一緒でファイル形式のみ異なります。ファイルサイズはjapan.topojsonの方が圧倒的に軽いので環境が許せばそちらを優先的に利用ください。使用ライセンスは配布元に準じ、非営利目的の場合は「出典元(地球地図日本)の明記」を、営利目的の場合は「出典元(地球地図日本)の明記」と「著作権者(地球地図日本)への利用報告」をお願いいたします。

* tokyo.geojson、tokyo.topojson

地球地図日本( http://www.gsi.go.jp/kankyochiri/gm_jpn.html )に掲載されているShapefileを変換し、ジオメトリー以外のデータとして、市区町村名（日本語と英語表記）とエリア分別（都区部、多摩、島嶼部。日本語と英語表記）ID(全国地方公共団体コード)を付加したファイルで、市区町村ごとに境がある東京地図。英語表記はGazetteer of Japan 2007に準じています( http://www.gsi.go.jp/ENGLISH/pape_e300284.html )。前者がGeoJSON、後者がTopoJSONで内容自体は一緒でファイル形式のみ異なります。ファイルサイズはtokyo.topojsonの方が圧倒的に軽いので環境が許せばそちらを優先的に利用ください。使用ライセンスは配布元に準じ、非営利目的の場合は「出典元(地球地図日本)の明記」を、営利目的の場合は「出典元(地球地図日本)の明記」と「著作権者(地球地図日本)への利用報告」をお願いいたします。

* fukushima.geojson、fukushima.topojson

地球地図日本( http://www.gsi.go.jp/kankyochiri/gm_jpn.html )に掲載されているShapefileを変換し、ジオメトリー以外のデータとして、市区町村名（日本語と英語表記）とID(全国地方公共団体コード)を付加したファイルで、市区町村ごとに境がある福島県の地図。英語表記はGazetteer of Japan 2007に準じています( http://www.gsi.go.jp/ENGLISH/pape_e300284.html )。前者がGeoJSON、後者がTopoJSONで内容自体は一緒でファイル形式のみ異なります。ファイルサイズはfukushima.topojsonの方が圧倒的に軽いので環境が許せばそちらを優先的に利用ください。使用ライセンスは配布元に準じ、非営利目的の場合は「出典元(地球地図日本)の明記」を、営利目的の場合は「出典元(地球地図日本)の明記」と「著作権者(地球地図日本)への利用報告」をお願いいたします。

全国地方公共団体コードは平成26年4月5日現在の資料を参照しています。

## 選挙区

* singleSeatBlock.geojson、singleSeatBlock.topojson

Data for Japanに掲載( http://dataforjapan.org/dataset/senkyoku300-shape )されているShapefileを変換し、GeoJSON、TopoJSONに変換したものです。また変換時に以下の変更を加えています。

	- 変換時に文字コードをShift JISからUTF-8へ変換しました。
	- UserID、タイトル、登録日、面積、周長を除くフィールドにはnull値しか入っていなかったためフィールドごと削除しました。
	- フィールド名はプログラムコードから参照するため、日本語表記を英語表記へ改めました(タイトル→title、登録日→submitdate、面積(m2)→area、周長(m)→circumfere)

使用ライセンスは配布元に準じ、Public Domainとします。