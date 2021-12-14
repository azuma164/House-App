function heat_map(lang) {
    width = document.body.clientWidth / 2;
    height = 400;

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

    d3.csv('data/city_language.csv').then(function(data) {
        data.forEach(function(d) {
            sum_lang = Number(d['en']) + Number(d['fr']) + Number(d['sp']) + Number(d['ge']) + Number(d['it']) + Number(d['la']) + Number(d['gr']) + Number(d['ru']) + Number(d['po']) + Number(d['ja']);
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

        d3.json("data/tokyo.topojson").then(function(data) {
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