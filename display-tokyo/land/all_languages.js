function all_languages(lang){
  var width = 1500;
  var height = 800;
  var residence = {};

  var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

  var color = d3.scaleLinear()
  .domain([500, 14000])
  .range([255,0]);

  var en_array = {}

  // ここでスクレイピングでデータを取得
  d3.csv('./test.csv').then(function(data){
      data.forEach(function(d){
          en_array[d['場所']] = d[lang];
      })
      showMap();
  })

  var tooltip = d3.select("body").append("div").attr("class", "tooltip")

  var div_btn = d3.select("body").append("div").attr("class", "btn")

  var button_en = div_btn.append("button").attr("onclick", "location.href='furnitureproduction.html'")
  var button_fr = div_btn.append("button").attr("onclick", "location.href='foodproduction.html'")
  var button_sp = div_btn.append("button").attr("onclick", "location.href='clothingproduction.html'")

  button_en.html("英語");
  button_fr.html("フランス語");
  button_sp.html("スペイン語");

  function showMap(){
      console.log(en_array)
      d3.json("./tokyo.topojson").then(function(data){
          var tokyo = topojson.feature(data, data.objects.tokyo);

          var projection = d3.geoMercator()
                              .center([139.5, 35.7])
                              .translate([width/2, height/2])
                              .scale(45000)
          var path = d3.geoPath().projection(projection);

          var pref = svg.selectAll("path")
              .data(tokyo.features)
              .enter()
              .append("path")
              .attr("d", path)
              .attr("fill", function(d){ 
                  console.log(d)
                  return "rgb(255," +
                  Math.floor(color(en_array[d.properties.ward_ja]))+ ", " +
                  Math.floor(color(en_array[d.properties.ward_ja])) + ")"}) 
              .attr("stroke", "#333333")
              .attr("stroke-width", 0.5);

          pref
          .on("mouseover", function(m, d){
              tooltip
                  .style("visibility", "visible")
                  .html("市区町村: "+d.properties.ward_ja+"<br>建物数: "+en_array[d.properties.ward_ja])
          })
          .on("mousemove", function(d){
              tooltip
                  .style("top", 0+ "px")
                  .style("left", 0 + "px")
          })
          .on("mouseout", function(d){
              tooltip.style("visibility", "hidden");
          })
      })
  }
}