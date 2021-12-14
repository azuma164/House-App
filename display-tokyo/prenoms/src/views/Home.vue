<template>
  <div>
   <div id='chart' ></div>
  </div>
</template>
<script>
  import * as d3 from 'd3'
  export default {
    name: 'Home',
    data() {
      return {
     }
    },
  methods:{
    createSvg(){
    const svg = 
    d3.select('#chart').append('svg')
    .attr('width',500)
    .attr('height',400);
    svg.append('rect')
    .attr('x',0)
    .attr('y',0)
    .attr('width',500)
    .attr('height',400)
    .style('fill','red')
    }
   },
 mounted(){
   this.createSvg();
   }
 }
</script>