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

  var zoom2 = d3.zoom()
  .scaleExtent([0.1, 10])
  .on("zoom", function(){
    container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  });

  const svg = d3.create("svg")
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .style("display", "block")
      .style("margin", "0 -14px")
      .style("cursor", "pointer")
      .call(zoom2)
      .on("click", (event) => zoom(event, root));

  var container = svg.append("g");
  
  var rect = svg.append("rect")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "none")
  .style("pointer-events", "all");

  const node = svg.append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
      .attr("fill", d => d.children ? color(d.depth) : "white")
      .attr("pointer-events", d => !d.children ? "none" : null)
      .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
      .on("mouseout", function() { d3.select(this).attr("stroke", null); })
      .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()))
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
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return t => zoomTo(i(t));
        });

    label
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
      .transition(transition)
        .style("fill-opacity", d => d.parent === focus ? 1 : 0)
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
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
