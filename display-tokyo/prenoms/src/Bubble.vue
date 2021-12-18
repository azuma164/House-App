<style>
@import "./css/language.css";
@import "./css/fonts.css";
</style>
<template>
<div>
  <div>
    <div id="word_cloud_text">
        <h2 id="word_cloud_selected_language"></h2>

        <h2 id="word_cloud_fixed_text">語の建物名</h2>
    </div>
    <div id="heat_map_text">
        <h2 id="heat_map_fixed_text">その言語の分布</h2>
    </div>
  </div>
  <div id="cloud"></div>
  <div id="map"></div>
</div>
</template>
<script>
  import * as d3 from 'd3'
  // import define from "./js/index.js";
  // import {Runtime, Library, Inspector} from "./js/runtime.js";
  // import {Runtime, Inspector} from "@observablehq/runtime";
  // import {define} from "./js/5831f55fccfa1c41@165.js";
  import {word_cloud} from './js/bubblechart'

  // const runtime = new Runtime();
  // const main = runtime.module(define);
  // main.value("foo").then(value => console.log(value));

  export default {
    name: 'bubble',
    data() {
      return {
     }
    },
  methods:{
    
   },
 mounted(){
   word_cloud();
   }
 }
</script>