<style>
@import "./css/header.css";
</style>
<template lang="pug">
<div id='app'>
  <header>
    <h1>
        <a href="/">建物<span>名</span>で見る物件</a>
    </h1>
    <nav class="nav">
        <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/routing">Routing</router-link></li>
            <li><router-link to="/time">Time</router-link></li>
        </ul>
    </nav>
  </header>
  <router-view/>
</div>
</template>

<script>
import { forenameColor, initialRange, maxBirthsCount, years } from './utils'
import * as d3 from 'd3'
import _ from 'lodash'
import graph from './graph.vue'

export default {
  name: 'app',
  components: { graph },
  data () {
    return {
      forenames: [],
      shareUrl: window.location.toString(),
      searchQuery: '',
      range: initialRange
    }
  },
  mounted () {
    console.log('mounted')
    const selectedIds = _.flatMap(window.location.hash.slice(1).split(','), id => /-[hf]$/.test(id) ? [id] : [id + '-f', id + '-h'])

    d3.json('forenames.json', (err, forenames) => {
      // window.data = data
      // window._ = _
      if (err) return window.alert(err)

      console.log('loaded', forenames.length)

      _.each(forenames, forenameData => {
        forenameData.selected = _.includes(selectedIds, forenameData.id + '-' + (forenameData.sex === 'm' ? 'h' : 'f'))
        forenameData.style = {}
        forenameData.births = _.map(years, (year, i) => ({ year, births: forenameData.births[i] }))
      })

      this.forenames = forenames
      this.$nextTick(window.onresize)
    })
  },

  watch: {
    forenames: 'refreshYearRange',
    selectedForenames (forenames) {
      window.location.hash = forenames.map(d => d.id + '-' + (d.sex === 'm' ? 'h' : 'f')).join(',')
      this.shareUrl = window.location.toString()
      console.log('watch!')
    }
  },

  methods: {
    toggleForename (forenameData) {
      forenameData.selected = !forenameData.selected
    },

    setYearRange (range) {
      this.range = range
      this.refreshYearRange()
    },

    refreshYearRange () {
      console.log('refreshYearRange')
      const overvallMax = maxBirthsCount(this.forenames, this.range)

      const fontSizeScale = d3
        .scalePow()
        .exponent(0.8)
        .domain([0, overvallMax])
        .range([16, 40])

      _(this.forenames)
        .each(forenameData => {
          // const [fontSize, lineHeight] = sizes[level]
          const fontSize = fontSizeScale(maxBirthsCount([forenameData], this.range)) + 'px'
          forenameData.style = { fontSize }
        })
    },

    forenameStyle (forenameData) {
      const backgroundColor = forenameData.selected ? forenameColor(forenameData) : ''
      return _.assign({ backgroundColor }, forenameData.style)
    },
    selectUrl () {
      this.$refs['share-url'].select()
    }
  },

  computed: {
    selectedForenames () {
      return _.filter(this.forenames, 'selected')
    },
    displayedForenames () {
      if (this.searchQuery === '') return this.forenames
      const sanitize = s => _.deburr(s).toLowerCase()
      const q = sanitize(this.searchQuery)

      return this.forenames.filter(d => sanitize(d.forename).includes(q))
    }
  }
}
</script>
