import * as d3 from "d3";
// import * as cloud from "d3-cloud";
import topojson from "./topojson";
const cloud = require('d3-cloud')
function word_cloud() {
    console.log('wordcloud!!')
    heat_map('en');
    console.log('wordcloud!!')
    var DATA_FILE_PATH = 'data.json'; // 読み込みデータファイル
    const TARGET_ELEMENT_ID = '#cloud'; // 描画先
    const languages = ["en", "fr", "it", "de", "gr", "ru", "es"];
    const fonts = ["serif", "Ink Free", "sans-serif", "Impact", "cursive", "script",
        "Arial Black"
    ]

    const fontScale = d3.scaleOrdinal().domain(languages).range(fonts);
    console.log(fontScale)
    console.log(d3.schemeCategory10)
    const colorScale = d3.scaleOrdinal().domain(languages).range(d3.schemeCategory10);
    console.log('hoge')

    d3.csv("src/data/words_count.csv", function(data_words) {
        console.log(data_words)
        let words = data_words.map(function(d) {
            return {
                kana_word: d.name,
                language: d.言語コード,
                meaning: d.意味,
                spelling: d.綴り,
                count: d.count
            }
        })

        // memory errorになるため、上位100のみを抽出する
        words = words.sort(function(a, b) {
            return (Number(a.count) > Number(b.count)) ? -1 : 1; //オブジェクトの降順ソート
        });

        words = words.slice(0, 110);

        var h = 400;
        var w = 600;

        var random = d3.randomIrwinHall(2);
        // var countMax = d3.max(data, function (d) { return d.count });
        const countMax = 3000;
        var sizeScale = d3.scaleLinear().domain([0, countMax]).range([10, 100])

        var words_original = words.map(function(d) {
            return {
                text: d.spelling,
                kana: d.kana_word,
                size: sizeScale(d.count), //頻出カウントを文字サイズに反映
                lang_font: fonts[languages.indexOf(d.language)],
                lang_color: colorScale(d.language),
                lang: d.language
            };
        });


        cloud().size([w, h])
            .words(words_original)
            .rotate(0)
            // .rotate(function () { return (~~(Math.random() * 6) - 3) * 30; })
            // .font("Impact")
            .fontSize(function(d) { return d.size; })
            .on("end", draw) //描画関数の読み込み
            .start();
        console.log('!!!!!!!!')

        d3.select("body").selectAll("p").html("jjjjj")

        // wordcloud 描画
        function draw(words) {

            d3.select(TARGET_ELEMENT_ID)
                .append("svg")
                .attr("class", "ui fluid image") // style using semantic ui
                .attr("viewBox", "0 0 " + w + " " + h) // ViewBox : x, y, width, height
                .attr("width", "100%") // 表示サイズの設定
                .attr("height", "100%") // 表示サイズの設定
                .append("g")
                .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("font-family", function(d) { return d.lang_font })
                .style("fill", function(d, i) { return d.lang_color })

            .style("background-image", "url(" + "uk.png" + ")")
                .style("-webkit-background-clip", "text")
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; })
                .attr("id", "name")
                .on("click", function(d, i) {
                    d.stopPropagation();
                    heat_map(i.lang);
                    words_clipped = words.filter(name => name.lang == i.lang);
                    d3.select("#cloud").select("svg").remove();
                    console.log('!!!!!!!!!')
                    cloud().size([w, h])
                        .words(words_clipped)
                        // .rotate(0)
                        .rotate(function() { return Math.random() > 0.5 ? 0 : 90 })
                        // .rotate(function () { return (~~(Math.random() * 6) - 3) * 30; })
                        // .font("Impact")
                        .fontSize(function(d) { return d.size; })
                        .on("end", draw) //描画関数の読み込み
                        .start();
                })
                .on("mouseover", function(d, i) {
                    const mouse_over_text = i;
                    const highlight_language = i.lang;
                    document.getElementById("word_cloud_selected_language").innerText = language_code_to_katakana(highlight_language);
                    // 他の国を薄くする。
                    d3.select("body").select("svg").selectAll("text").each(function(d, i) {
                        if (d.lang != highlight_language) {
                            d3.select(this).style("fill", "lightgrey");
                        } else {
                            // 日本語に反転する
                            // d3.select(this).text(function (d) { return d.kana })
                            // d3.select(this).style("font-size", Number(d3.select(this).style("font-size").replace("px")) / 3)
                        }
                    })

                    // 背景の変更
                    // d3.select("#cloud").style("background-image", "url(" + highlight_language + ".png)");

                })
                .on("mouseout", function(d, i) {
                    document.getElementById("word_cloud_selected_language").innerText = "";

                    // 色を戻す
                    d3.select("body").select("svg").selectAll("text").each(function(d) {
                        d3.select(this).style("fill", function(d, i) { return d.lang_color })
                    })

                    d3.select("#cloud").style("background-image", null);

                });

            d3.select("svg").on("click", function(d) {
                d3.selectAll("svg").remove();
                cloud().size([w, h])
                    .words(words_original)
                    .rotate(function() { return Math.random() > 0.5 ? 0 : 90 })
                    // .rotate(function () { return (~~(Math.random() * 6) - 3) * 30; })
                    // .font("Impact")
                    .fontSize(function(d) { return d.size; })
                    .on("end", draw) //描画関数の読み込み
                    .start();
            })
            const lang_name = d3.select("body").select("svg").selectAll("lang_name")
        }
    });
}

function heat_map(lang) {
    console.log('lang='+lang)
    var width = document.body.clientWidth / 2;
    var height = 400;

    d3.select("#map").select("svg").remove();

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    var title = '';
    switch (lang) {
        case 'en':
            title = '英語'
            break
        case 'fr':
            title = 'フランス語'
            break
        case 'sp':
            title = 'スペイン語'
            break
        case 'ge':
            title = 'ドイツ語'
            break
        case 'it':
            title = 'イタリア語'
            break
        case 'la':
            title = 'ラテン語'
            break
        case 'gr':
            title = 'ギリシャ語'
            break
        case 'ru':
            title = 'ロシア語'
            break
        case 'po':
            title = 'ポルトガル語'
            break
        case 'ja':
            title = '日本語'
            break
        default:
            title = ''
    }

    // d3.select("body").append("h2").html(title).attr("class", "title_lang")

    var lang_array = {}

    var max_num_city = 0
        // ここでスクレイピングでデータを取得

    d3.csv('src/data/city_language.csv',function(data) {
        console.log('data='+data)
        data.forEach(function(d) {
            var sum_lang = Number(d['en']) + Number(d['fr']) + Number(d['sp']) + Number(d['ge']) + Number(d['it']) + Number(d['la']) + Number(d['gr']) + Number(d['ru']) + Number(d['po']) + Number(d['ja']);
            if (sum_lang != 0) {
                lang_array[d['city']] = Number(d[lang]) / sum_lang;
            } else {
                lang_array[d['city']] = 0;
            }
            if (lang_array[d['city']] > Number(max_num_city)) {
                max_num_city = lang_array[d['city']]
            }
        })
        showMap();
    })

    var tooltip = d3.select("body").append("div").attr("class", "tooltip")

    function showMap() {
        var color = d3.scaleLinear()
            .domain([0, max_num_city])
            .range([255, 0]);

        d3.json("src/data/tokyo.topojson", function(data) {
            var tokyo = topojson.feature(data, data.objects.tokyo);

            var projection = d3.geoMercator()
                .center([139.8, 35.7])
                .translate([width / 2, height / 2])
                .scale(60000)
            var path = d3.geoPath().projection(projection);

            var pref = svg.selectAll("path")
                .data(tokyo.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", function(d) {
                    if (d.properties.area_ja != "都区部") {
                        return "rgb(255,255,255)";
                    } else {
                        return "rgb(25," +
                            Math.floor(color(lang_array[d.properties.ward_ja])) + ", " +
                            Math.floor(color(lang_array[d.properties.ward_ja])) + ")"
                    }
                })
                .attr("stroke", "rgb(255,255,255)")
                .attr("stroke-width", 0.5);

            // pref
            //     .on("mouseover", function(m, d) {
            //         tooltip
            //             .style("visibility", "visible")
            //             .html("市区町村: " + d.properties.ward_ja + "<br>建物数: " + lang_array[d.properties.ward_ja])
            //     })
            //     .on("mousemove", function(d) {
            //         tooltip
            //             .style("top", 0 + "px")
            //             .style("left", 0 + "px")
            //     })
            //     .on("mouseout", function(d) {
            //         tooltip.style("visibility", "hidden");
            //     })
        })
    }
}

function language_code_to_katakana(code) {
    switch (code) {
        case "en":
            return "英";
            break;
        case "fr":
            return "フランス";
            break;
        case "it":
            return "イタリア"
        case "es":
            return "スペイン"
        case "de":
            return "ドイツ"
        case "gr":
            return "ギリシャ"
        case "ru":
            return "ロシア"
        case "la":
            return "ラテン"
    }
}

export {word_cloud, heat_map, language_code_to_katakana};