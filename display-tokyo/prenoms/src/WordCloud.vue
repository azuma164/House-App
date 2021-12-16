<style>
@import "./css/language.css";
@import "./css/fonts.css";
/* @import "../css/normalize.css"; */
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
  // import * as d3 from 'd3'
  // import heat_map from './js/heat_map'
  import Topo from './js/topojson'
  import {word_cloud, heat_map, language_code_to_katakana} from './js/word_cloud'
  import {d3_cloud} from './js/d3.layout.cloud'
  export default {
    name: 'Home2',
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