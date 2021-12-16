<style>
@import "../css/language.css";
@import "../css/fonts.css";
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
  <!-- <a href="#" class="arrow"></a> -->
  <div id="map"></div>
  <div v-el:script-holder1></div>
  <div v-el:script-holder2></div>
  <div v-el:script-holder3></div>
  <div v-el:script-holder4></div>
  <div v-el:script-holder5></div>
</div>
</template>

<script>
  // import * as d3 from 'd3'
  // import {heat_map} from '../js/heat_map'
  // import Topo from '../js/topojson'
  // import Word from '../js/word_cloud'
  // import {d3_cloud} from '../js/d3.layout.cloud'
  export default {
    name: 'Home',
    data() {
      return {
     }
    },
  methods:{
   },
 mounted(){
   let scriptEl1 = document.createElement('script');
   let scriptEl2 = document.createElement('script');
   let scriptEl3 = document.createElement('script');
   let scriptEl4 = document.createElement('script');
   let scriptEl5 = document.createElement('script');
    scriptEl1.setAttribute('src', '../js/word_cloud.js');
    scriptEl2.setAttribute('src', '../js/d3.js');
    scriptEl3.setAttribute('src', '../js/d3.layout.cloud.js');
    scriptEl4.setAttribute('src', '../js/heat_map.js');
    scriptEl5.setAttribute('src', '../js/topojson.js');
   this.$refs.scriptHolder1.appendChild(scriptEl1);
   this.$refs.scriptHolder2.appendChild(scriptEl2);
   this.$refs.scriptHolder3.appendChild(scriptEl3);
   this.$refs.scriptHolder4.appendChild(scriptEl4);
   this.$refs.scriptHolder5.appendChild(scriptEl5);
   word_cloud();
   }
 }
</script>