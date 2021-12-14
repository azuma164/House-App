<template>
  <div>
   <div id='chart' ></div>
  </div>
</template>
<script>
  import * as d3 from 'd3'
  import Lang from '../all_languages'
  export default {
    name: 'Routing',
    data() {
      return {
     }
    },
  methods:{
    
   },
 mounted(){
   Lang.all_languages('en', d3);
   }
 }
</script>