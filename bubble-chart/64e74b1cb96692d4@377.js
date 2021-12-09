// https://observablehq.com/@d3/bubble-chart@377
import define1 from "./7a9e12f9fb3d8e06@459.js";
import define2 from "./a33468b95d0b15b0@808.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["flare.csv",new URL("./files/aee5d40e70ea9830c96efe6da03ad32187ff7223ad1b7b84e38c32127ccf6661b576fe0005b42657703e7bfaaefabc74550268cc35f64122a652fc471110c832",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Circle Packing, Bubble Chart

Bubble charts are non-hierarchical [packed circles](/@d3/pack?collection=@d3/charts). The area of each circle is proportional its value (here, file size). The organic appearance of these diagrams can be intriguing, but also consider a [treemap](/@d3/treemap?collection=@d3/charts) or a humble [bar chart](/@d3/horizontal-bar-chart?collection=@d3/charts).`
)});
  main.variable(observer("key")).define("key", ["Swatches","chart"], function(Swatches,chart){return(
Swatches(chart.scales.color)
)});
  main.variable(observer("chart")).define("chart", ["BubbleChart","files"], function(BubbleChart,files){return(
BubbleChart(files, {
  label: d => [...d.id.split(".").pop().split(/(?=[A-Z][a-z])/g), d.value.toLocaleString("en")].join("\n"),
  value: d => d.value,
  group: d => d.id.split(".")[1],
  title: d => `${d.id}\n${d.value.toLocaleString("en")}`,
  // link: d => `https://github.com/prefuse/Flare/blob/master/flare/src/${d.id.replace(/\./g, "/")}.as`,
  width: 1152
})
)});
  main.variable(observer("flare")).define("flare", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("flare.csv").csv({typed: true})
)});
  main.variable(observer("files")).define("files", ["flare"], function(flare){return(
flare.filter(d => d.value !== null)
)});
  main.variable(observer()).define(["howto"], function(howto){return(
howto("BubbleChart")
)});
  main.variable(observer("BubbleChart")).define("BubbleChart", ["d3","location"], function(d3,location){return(
function BubbleChart(data, {
  name = ([x]) => x, // alias for label
  label = name, // given d in data, returns text to display on the bubble
  value = ([, y]) => y, // given d in data, returns a quantitative size
  group, // given d in data, returns a categorical value for color
  title, // given d in data, returns text to show on hover
  link, // given a node d, its link (if any)
  linkTarget = "_blank", // the target attribute for links, if any
  width = 640, // outer width, in pixels
  height = width, // outer height, in pixels
  padding = 3, // padding between circles
  margin = 1, // default margins
  marginTop = margin, // top margin, in pixels
  marginRight = margin, // right margin, in pixels
  marginBottom = margin, // bottom margin, in pixels
  marginLeft = margin, // left margin, in pixels
  groups, // array of group names (the domain of the color scale)
  colors = d3.schemeTableau10, // an array of colors (for groups)
  fill = "#ccc", // a static fill color, if no group channel is specified
  fillOpacity = 0.7, // the fill opacity of the bubbles
  stroke, // a static stroke around the bubbles
  strokeWidth, // the stroke width around the bubbles, if any
  strokeOpacity, // the stroke opacity around the bubbles, if any
} = {}) {
  // Compute the values.
  const D = d3.map(data, d => d);
  const V = d3.map(data, value);
  const G = group == null ? null : d3.map(data, group);
  const I = d3.range(V.length).filter(i => V[i] > 0);

  
  // Unique the groups.
  if (G && groups === undefined) groups = I.map(i => G[i]);
  groups = G && new d3.InternSet(groups);
  
  // Construct scales.
  const color = G && d3.scaleOrdinal(groups, colors);
  
  // Compute labels and titles.
  const L = label == null ? null : d3.map(data, label);
  const T = title === undefined ? L : title == null ? null : d3.map(data, title);

  // Compute layout: create a 1-deep hierarchy, and pack it.
  const root = d3.pack()
  .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
  .padding(padding)
    (d3.hierarchy({children: I})
      .sum(i => V[i]));
      
  let view;
  let focus = root;

  const svg = d3.create("svg")
  .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-marginLeft, -marginTop, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .attr("fill", "currentColor")
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")

  const leaf = svg.selectAll("a")
    .data(root.leaves())
    .join("a")
      .attr("xlink:href", link == null ? null : (d, i) => link(D[d.data], i, data))
      .attr("target", link == null ? null : linkTarget)
      .attr("transform", d => `translate(${d.x},${d.y})`)
      // .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));


  leaf.append("circle")
      .attr("class", "view")
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-opacity", strokeOpacity)
      .attr("fill", G ? d => color(G[d.data]) : fill == null ? "none" : fill)
      .attr("fill-opacity", fillOpacity)
      // .attr("pointer-events", d => !d.children ? "none" : null)
      .attr("r", d => d.r)
      .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
      .on("mouseout", function() { d3.select(this).attr("stroke", null); })
      // .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));


  if (T) leaf.append("title")
      .text(d => T[d.data]);

  if (L) {
    // A unique identifier for clip paths (to avoid conflicts).
    const uid = `O-${Math.random().toString(16).slice(2)}`;

    leaf.append("clipPath")
        .attr("id", d => `${uid}-clip-${d.data}`)
      .append("circle")
        .attr("r", d => d.r);

    leaf.append("text")
        .attr("clip-path", d => `url(${new URL(`#${uid}-clip-${d.data}`, location)})`)
      .selectAll("tspan")
      .data(d => `${L[d.data]}`.split(/\n/g))
      .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i, D) => `${i - D.length / 2 + 0.85}em`)
        .attr("fill-opacity", (d, i, D) => i === D.length - 1 ? 0.7 : null)
        .text(d => d);
  }

  d3.select("#resetButton")
    .on("click", resetted);
 
  var zoom = d3.zoom()
    .scaleExtent([1, 40])
    .translateExtent([
      [-100, -100],
      [width + 90, height + 100]
    ])
    .on("zoom", zoomed);
 
  svg.call(zoom);
 
  function zoomed() {
    leaf.attr("transform", d3.event.transform);
    gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
    gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
  }
 
  function resetted() {
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity);
  }

  // 変更開始
  //zoomTo([root.x, root.y, root.r * 2]);

  // function zoomTo(v) {
  //   const k = width / v[2];
  //   console.log(v)
  //   view = v;
  //   console.log(v)
  //   label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
  //   node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
  //   node.attr("r", d => d.r * k);
  // }

  // function zoom(event, d) {
  //   const focus0 = focus;

  //   focus = d;
  //   console.log(d)
  //   const transition = svg.transition()
  //       .duration(event.altKey ? 7500 : 750)
  //       .tween("zoom", d => {
  //         const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
  //         return t => zoomTo(i(t));
  //       });

  //   label
  //     .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
  //     .transition(transition)
  //       .style("fill-opacity", d => d.parent === focus ? 1 : 0)
  //       .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
  //       .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  // }

  return Object.assign(svg.node(), {scales: {color}});
}
)});
  const child1 = runtime.module(define1);
  main.import("howto", child1);
  const child2 = runtime.module(define2);
  main.import("Swatches", child2);
  return main;
}
