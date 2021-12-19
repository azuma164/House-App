// https://observablehq.com/@d3/zoomable-circle-packing@165
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["flare-2.json",new URL("./files/categoryfile",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
//   main.variable(observer()).define(["md"], function(md){return(
// md`# Zoomable Circle Packing
// Click to zoom in or out.`
// )});
main.variable(observer("chart")).define("chart", ["pack","data","d3","width","height","color"], function(pack,data,d3,width,height,color)
{
  const root = pack(data);
  let focus = root;
  let view;
  var zoomed = false;

  var zoom2 = d3.zoom()
  .scaleExtent([0.1, 10])
  .on("zoom", function(d){
    container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  });

  const svg = d3.create("svg")
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .style("display", "block")
      .style("margin-right", "20%")
      .style("cursor", "pointer")
      .style("background", "#FAF8ED")
      .call(zoom2)
      .on("click", (event) => zoom(event, root));

  var container = svg.append("g");
  
  var rect = svg.append("rect")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "none")
  .style("pointer-events", "all");

  var languageHash = {};
  d3.csv("./meaning.csv").then(function(data){
    data.forEach(function(d){
      languageHash[d['綴り']] = [d['言語コード'], d['意味']]
      console.log([d['言語コード'], d['意味']])
    })
    console.log('lang='+JSON.stringify(languageHash))
  })
  console.log('lang_hash='+JSON.stringify(languageHash))

  var nameHash = {};
  var limit = 15
  d3.csv("./files/alphabet_to_housename.csv").then(function(data){
    data.forEach(function(d){
      if (!(d["alphabet"] in nameHash)){
        nameHash[d["alphabet"]] = []
      } 
      if (nameHash[d["alphabet"]].length < limit){
        nameHash[d["alphabet"]].push(d["name"])
      }
    })
  })

  var tooltip = d3.select("body").append("div").attr("class", "tooltip-bubble")

  const node = svg.append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
      .attr("fill", d => d.children ? color(d.depth) : "white")
      // .attr("pointer-events", function(d) {
      //   if (zoomed == false){
      //     return !d.children ? "none" : null
      //   }
      // })
      .on('mouseover', function(e, d) {
        d3.select(this).attr("stroke", "#000");
        if (!d.children){
          tooltip
            .style("visibility", "visible")
            .html("word: "+d.data.name +"<br>lang: "+languageHash[d.data.name][0]+"<br>meaning: "+languageHash[d.data.name][1]+"<br>building: "+nameHash[d.data.name])
        }
      })
      // .on("mousemove", function(e, d){
      //   console.log(d)
      //   tooltip
      //       .style("top", "px")
      //       .style("left", "px")
      // })
      .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("stroke", null); 
      })
      .on("click", function(event, d) {
        if (d.children) {
          focus !== d && (zoom(event, d), event.stopPropagation());
        }
        else {
          focus !== d && (zoom(event, d.parent), event.stopPropagation());
          name_map(d.data.name);
        }
      })
      .attr("transform", function(d) {    // 円のX,Y座標を設定
        return "translate(" + 20 + "," + 50 + ")";
      })

  const label = svg.append("g")
      .style("font", "6px sans-serif")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants())
    .join("text")
      .style("fill-opacity", d => d.parent === root ? 1 : 0)
      .style("display", d => d.parent === root ? "inline" : "none")
      .text(d => d.data.name);

  zoomTo([root.x, root.y, root.r * 2]);

  function zoomTo(v) {
    const k = width / v[2]; //width / v[2]

    view = v;
//0.4はすべて適当に付けました
    label.attr("transform", d => `translate(${(d.x - v[0]) * k * 0.4},${(d.y - v[1]) * k * 0.4})`);
    node.attr("transform", d => `translate(${(d.x - v[0]) * k * 0.4},${(d.y - v[1]) * k * 0.4})`);
    node.attr("r", d => d.r * k * 0.4);
  }

  function zoom(event, d) {
    const focus0 = focus;

    focus = d;

    const transition = svg.transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", d => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 * 0.8]);
          return t => zoomTo(i(t));
        });

    label
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
      .transition(transition)
        .style("fill-opacity", d => d.parent === focus ? 1 : 0)
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  function name_map(name) {
    const width = 500; //document.body.clientWidth / 2;
    const height = 500; //400
  
    d3.select("#map").select("svg").remove();
  
    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);
  
    var title = '';
  
    var lang_array = {}
  
    var max_language_rate = 0;
    let min_language_rate = 1;
    // ここでスクレイピングでデータを取得
  
    // d3.csv('data/city_language.csv').then(function(data) {
    //     data.forEach(function(d) {
    //         var sum_buildings = Number(d['en']) + Number(d['fr']) + Number(d['sp']) + Number(d['ge']) + Number(d['it']) + Number(d['la']) + Number(d['gr']) + Number(d['ru']) + Number(d['po']) + Number(d['ja']);
    //         let language_rate = Number(d[lang]) / sum_buildings // その言語がその区の建物数にしめる割合
    //         lang_array[d['city']] = language_rate
  
    //         if (language_rate > max_language_rate) {
    //             max_language_rate = language_rate
    //         }
    //         if (language_rate < min_language_rate) {
    //             min_language_rate = language_rate
    //         }
    //     })
    //     console.log(min_language_rate, max_language_rate)
    //     showMap();
    // })
    showMap(name);
  
    function showMap(name) {
        // var color = d3.scaleLinear()
        //     .domain([min_language_rate, max_language_rate])
        //     .range([255, 0]);
  
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
                        return "green"
                    }
                })
                .attr("stroke", "rgb(255,255,255)")
                .attr("stroke-width", 0.5);
  
            // pref
            //     .on("mouseover", function(m, d) {
            //         if (d.properties.area_ja == "都区部") {
            //             tooltip
            //                 .style("visibility", "visible")
            //                 .html(d.properties.ward_ja + "<br>" + Math.round(lang_array[d.properties.ward_ja] * 1000) / 1000)
            //         }
            //     })
            //     .on("mousemove", function(d) {
            //         tooltip
            //             .style("top", d.clientY + "px")
            //             .style("left", d.clientX + "px")
            //     })
            //     .on("mouseout", function(d) {
            //         tooltip.style("visibility", "hidden");
            //     })
            var pointHash = {}
            d3.csv("./files/alphabet_to_points.csv").then(function(data){
              data.forEach(function(d){
                if (!(d["alphabet"] in pointHash)){
                  pointHash[d["alphabet"]] = []
                } 
                pointHash[d["alphabet"]].push([Number(d["x"]), Number(d["y"])]);
              })
              var pointdata = [[139, 36], [138, 37]];
              if (name in pointHash){
                pointdata = pointHash[name]
                console.log(pointdata)
              }
              var point = svg.selectAll("circle")
                          .data(pointdata)
                          .enter()
                          .append("circle")
                          .attr("cx", function (d) { console.log(projection(d)); return projection(d)[0]; })
                          .attr("cy", function (d) { return projection(d)[1]; })
                          .attr("r", "3px")
                          .attr("fill", "red")
            })
        })
    }
  }

  return svg.node();
}
);
  main.define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("flare-2.json").json()
)});
  main.define("pack", ["d3","width","height"], function(d3,width,height){return(
data => d3.pack()
    .size([width, height])
    .padding(3)
  (d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value))
)});
  main.define("width", function(){return(
450 //932
)});
  main.define("height", ["width"], function(width){return(
200 //width //main.variable(observer("height"))
)});
  main.define("format", ["d3"], function(d3){return(
d3.format(",d")
)});
  main.define("color", ["d3"], function(d3){return(
d3.scaleLinear()
    .domain([0, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl)
)});
  main.define("d3", ["require"], function(require){return(
require("d3@6")
)});
  return main;
}
