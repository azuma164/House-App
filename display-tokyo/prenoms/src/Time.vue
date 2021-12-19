<style lang="stylus">
@import "./css/colors"

html
  height 100%
  margin 0
  padding 0


content
  display: flex
  flex-direction: row
  padding-left: 19px;

.left-side
  width: 50%;
  height: 710px;
  float: left;
  background-color: #ffffff;
  border-radius: 10px;
  border: 4px solid #19b244;
  margin: 10px;

.right-side
  width: 50%;
  height: 710px;
  background-color: #ffffff;
  border-radius: 10px;
  border: 4px solid #19b244;
  margin: 10px;
  float: right;

form.search
  position: relative
  height: 32px
  > *
    position: absolute

  .search-image
    left: 4px
    top: 6px

  .clear
    top: 6px
    right: 0

  input
    color: #333
    font-family: "HelveticaLTStd-Roman"
    font-size: 19px
    padding-left 26px
    padding-top 4px
    width: calc(100% - 30px)
  a
    color: red
    font-family: sans-serif
    right: 0
    text-decoration: none

.forenames-list-container
  flex: 1
  overflow scroll
  margin-top 10px

ul.forenames-list
  list-style none
  padding 0
  margin 0
  display: flex
  flex-wrap: wrap
  justify-content: space-between
  li
    cursor pointer
    padding 3px
    line-height 0.9
    display: inline-flex
    align-items: center
    &.m
      color color-male
    &.f
      color color-female
    &.selected
      line-height 1
      color white

.share-url
  cursor: crosshair

.bottom
  margin-bottom: 20px
  padding: 20px 95px 0 50px
  font-size: 12px
  color: color-male

  input[type=text]
    color: #333333
    width: 250px

  .block
    display flex
    justify-content: space-between
  a
    text-decoration: none
  .social-links > *
    margin-left 10px
  .social
    float: left
    margin-top: -9px
    width: 117px
    > *
      display: block
  .logo
    margin-top: -8px
    margin-left: -5px
    float: left
  .explanations
    margin-top: 1em
</style>

<template lang="pug">
#time
    .title
      h2 時代で見る
    .left-side
      form.search
        input(type="text" autocomplete="off" placeholder="Research..." v-model="searchQuery")
        img.search-image(src="./images/search.png")
        a.clear(href="#" v-show="searchQuery.length" @click="searchQuery = ''")
          img(src="./images/clear.png")/
      .forenames-list-container
        ul.forenames-list(ref="forenamesList")
          li(v-for="forenameData in displayedForenames",
            :class="[forenameData.sex, forenameData.selected ? 'selected' : '']",
            :style="forenameStyle(forenameData)",
            :title="forenameData.alternatives ? 'autres orthographes: ' + forenameData.alternatives.join(', ') : null",
            v-text="forenameData.forename"
            @click.prevent="toggleForename(forenameData)"
          )
    .right-side
      graph(
        :forenames="selectedForenames",
        @forename:remove="toggleForename",
        @year-range="setYearRange"
      )
//- <div id="time">
//-   <slot class="title">
//-     <h2>1950~2021</h2>
//-     <h1>東京の72年間における名称ごとの物件数の変化</h1>
//-     <form class="search">
//-       <input type="text" autocomplete="off" placeholder="Research..." v-model="searchQuery">
//-       <img class="search-image" src="./images/search.png" />
//-       <a class="clear" href="#" v-show="searchQuery.length">
//-     </form>
//-   </slot>
//- </div>
</template>

<script>
import { forenameColor, initialRange, maxBirthsCount, years } from './utils'
import * as d3 from 'd3'
import _ from 'lodash'
import graph from './graph.vue'

export default {
  name: 'time',
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
          const fontSize = fontSizeScale(maxBirthsCount([forenameData], this.range)*0.7) + 'px'
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
