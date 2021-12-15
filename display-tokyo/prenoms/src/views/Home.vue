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
   },
 mounted(){
   this.createSvg();
   }
 }
</script>