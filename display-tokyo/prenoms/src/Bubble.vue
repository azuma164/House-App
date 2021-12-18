<template>
  <div id='chart'>
  </div>
</template>
<script>
  import * as d3 from 'd3'
  // import define from "./js/index.js";
  // import {Runtime, Library, Inspector} from "./js/runtime.js";
  // import {Runtime, Inspector} from "@observablehq/runtime";
  import {define} from "./js/5831f55fccfa1c41@165.js";

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
   define();
   }
 }
</script>