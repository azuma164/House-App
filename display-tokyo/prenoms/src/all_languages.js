function all_languages(lang, d3){
  var width = 1500;
  var height = 800;
  var residence = {};
  console.log(d3)
  
  var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);
  
  console.log('hogehoge')
  var title = '';
  switch(lang){
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

  d3.select("body").append("h2").html(title).attr("class", "title_lang")

  var lang_array = {}

  var max_num_city = 0
  // ここでスクレイピングでデータを取得
  d3.csv('./city_language.csv').then(function(data){
      data.forEach(function(d){
          lang_array[d['city']] = d[lang];
          if (Number(d[lang]) > Number(max_num_city)){
            max_num_city = Number(d[lang])
            // console.log(max_num_city)
          }
      })
      console.log(max_num_city)
      showMap();
  })
  console.log(max_num_city)

  var tooltip = d3.select("body").append("div").attr("class", "tooltip")

  var div_btn = d3.select("body").append("div").attr("class", "btn")

  var button_en = div_btn.append("button").attr("onclick", "location.href='tokyo_en.html'")
  var button_fr = div_btn.append("button").attr("onclick", "location.href='tokyo_fr.html'")
  var button_sp = div_btn.append("button").attr("onclick", "location.href='tokyo_sp.html'")
  var button_ge = div_btn.append("button").attr("onclick", "location.href='tokyo_ge.html'")
  var button_it = div_btn.append("button").attr("onclick", "location.href='tokyo_it.html'")
  var button_la = div_btn.append("button").attr("onclick", "location.href='tokyo_la.html'")
  var button_gr = div_btn.append("button").attr("onclick", "location.href='tokyo_gr.html'")
  var button_ru = div_btn.append("button").attr("onclick", "location.href='tokyo_ru.html'")
  var button_po = div_btn.append("button").attr("onclick", "location.href='tokyo_po.html'")
  var button_ja = div_btn.append("button").attr("onclick", "location.href='tokyo_ja.html'")
  

  button_en.html("英語");
  button_fr.html("フランス語");
  button_sp.html("スペイン語");
  button_ge.html("ドイツ語");
  button_it.html("イタリア語");
  button_la.html("ラテン語");
  button_gr.html("ギリシャ語");
  button_ru.html("ロシア語");
  button_po.html("ポルトガル語");
  button_ja.html("日本語");
  

  function showMap(){
      var color = d3.scaleLinear()
      .domain([0, max_num_city])
      .range([255,0]);

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
                  return "rgb(255," +
                  Math.floor(color(lang_array[d.properties.ward_ja]))+ ", " +
                  Math.floor(color(lang_array[d.properties.ward_ja])) + ")"}) 
              .attr("stroke", "#333333")
              .attr("stroke-width", 0.5);

          pref
          .on("mouseover", function(m, d){
              tooltip
                  .style("visibility", "visible")
                  .html("市区町村: "+d.properties.ward_ja+"<br>建物数: "+lang_array[d.properties.ward_ja])
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

export default {
  all_languages
}