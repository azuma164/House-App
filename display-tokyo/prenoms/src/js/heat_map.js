function heat_map(lang) {
    const width = document.body.clientWidth / 2;
    const height = 400;

    d3.select("#map").select("svg").remove();

    console.log('JJJJJJJJ')

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    var title = '';
    switch (lang) {
        case 'es':
            lang = "sp"
            break
        case 'de':
            lang = "ge"
            break
        case 'el':
            lang = "gr"
            break
        default:
            break;
    }



    // d3.select("body").append("h2").html(title).attr("class", "title_lang")

    var lang_array = {}

    var max_language_rate = 0;
    let min_language_rate = 1;
    // ここでスクレイピングでデータを取得

    d3.csv('src/data/city_language.csv',function(data) {
        data.forEach(function(d) {
            var sum_buildings = Number(d['en']) + Number(d['fr']) + Number(d['sp']) + Number(d['ge']) + Number(d['it']) + Number(d['la']) + Number(d['gr']) + Number(d['ru']) + Number(d['po']) + Number(d['ja']);
            let language_rate = Number(d[lang]) / sum_buildings // その言語がその区の建物数にしめる割合
            lang_array[d['city']] = language_rate

            if (language_rate > max_language_rate) {
                max_language_rate = language_rate
            }
            if (language_rate < min_language_rate) {
                min_language_rate = language_rate
            }
        })
        console.log(min_language_rate, max_language_rate)
        showMap();
    })

    var tooltip = d3.select("body").append("div").attr("class", "tooltip")

    function showMap() {
        // var color = d3.scaleLinear()
        //     .domain([min_language_rate, max_language_rate])
        //     .range([255, 0]);

        const color = d3.scaleLinear()
            .domain([min_language_rate - 0.01, max_language_rate]).range(["white", "#19B244"]);

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
                        return color(lang_array[d.properties.ward_ja])
                    }
                })
                .attr("stroke", "rgb(255,255,255)")
                .attr("stroke-width", 0.5);

            pref
                .on("mouseover", function(m, d) {
                    if (d.properties.area_ja == "都区部") {
                        tooltip
                            .style("visibility", "visible")
                            .html(d.properties.ward_ja + "<br>" + Math.round(lang_array[d.properties.ward_ja] * 1000) / 1000)
                    }
                })
                .on("mousemove", function(d) {
                    tooltip
                        .style("top", d.clientY + "px")
                        .style("left", d.clientX + "px")
                })
                .on("mouseout", function(d) {
                    tooltip.style("visibility", "hidden");
                })
        })
    }
}