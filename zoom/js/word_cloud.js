function word_cloud() {
    var DATA_FILE_PATH = 'data.json'; // 読み込みデータファイル
    const TARGET_ELEMENT_ID = '#cloud'; // 描画先
    const languages = ["en", "fr", "it", "de", "gr", "ru", "es"];
    const fonts = ["serif", "Ink Free", "sans-serif", "Impact", "cursive", "script",
        "Arial Black"
    ]

    const fontScale = d3.scaleOrdinal().domain(languages).range(fonts);
    const colorScale = d3.scaleOrdinal().domain(languages).range(d3.schemeDark2);

    d3.csv("data/words_count.csv").then(function(data_words) {
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
        // words = words.sort(function(a, b) {
        //     return (Number(a.count) > Number(b.count)) ? -1 : 1; //オブジェクトの降順ソート
        // });

        // words = words.slice(0, 110);

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


        d3.layout.cloud().size([w, h])
            .words(words_original)
            .rotate(0)
            // .rotate(function () { return (~~(Math.random() * 6) - 3) * 30; })
            // .font("Impact")
            .fontSize(function(d) { return d.size; })
            .on("end", draw) //描画関数の読み込み
            .start();

        d3.select("body").selectAll("p").html("jjjjj")

        let is_selected = false;

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
                    is_selected = true;
                    heat_map(i.lang);
                    var words_clipped = words.filter(name => name.lang == i.lang);
                    d3.select("#cloud").select("svg").remove();
                    d3.layout.cloud().size([w, h])
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
                    if (!is_selected) {
                        document.getElementById("word_cloud_selected_language").innerText = "";
                    }

                    // 色を戻す
                    d3.select("body").select("svg").selectAll("text").each(function(d) {
                        d3.select(this).style("fill", function(d, i) { return d.lang_color })
                    })

                    d3.select("#cloud").style("background-image", null);

                });

            d3.select("svg").on("click", function(d) {
                if (is_selected) {
                    d3.selectAll("svg").remove();
                    is_selected = false;
                    document.getElementById("word_cloud_selected_language").innerText = "";
                    d3.layout.cloud().size([w, h])
                        .words(words_original)
                        .rotate(0)
                        // .rotate(function() { return Math.random() > 0.5 ? 0 : 90 })
                        // .rotate(function () { return (~~(Math.random() * 6) - 3) * 30; })
                        // .font("Impact")
                        .fontSize(function(d) { return d.size; })
                        .on("end", draw) //描画関数の読み込み
                        .start();
                }
            })
            const lang_name = d3.select("body").select("svg").selectAll("lang_name")
        }
    });

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
        case "el":
            return "ギリシャ"
        case "ru":
            return "ロシア"
        case "la":
            return "ラテン"
        case "pt":
            return "ポルトガル"
        case "ja":
            return "日本"

    }

}