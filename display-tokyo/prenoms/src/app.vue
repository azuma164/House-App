<template lang="pug">
#app
    #nav
    .tab-area-base
      div
      .tab-menu-base
        ul
        li
        router-link(to='/') Home
        li
        router-link(to='/routing') Routing
        li
        router-link(to='/time') Time
      router-view
      //- .bottom
        //- .block
        //-   .share-url
        //-     div Partagez ces résultats avec ce lien :
        //-     input(ref="share-url" type="text" @click="selectUrl", :value="shareUrl")
        //-   .social-links
        //-     iframe(src="https://www.facebook.com/plugins/share_button.php?href=http%3A%2F%2Fdataaddict.fr%2Fprenoms%2F&layout=button_count&size=large&mobile_iframe=true&appId=388906134841894&width=120&height=28" width="120" height="28" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true")
        //-     a.twitter-share-button(href="https://twitter.com/share" data-size="large" data-via="_Data_Addict_" data-lang="fr" data-hashtags="70ansdeprénoms")
        //-     a.github-button(href="https://github.com/dataaddict/prenoms" data-style="mega" aria-label="Star dataaddict/prenoms on GitHub") Star
        //- .explanations
        //-   | Les prénoms sélectionnés sont les plus courants en France, ils ont été donnés au moins 2000 fois entre 1945 et 2015. Source :
        //-   a(href="https://www.insee.fr/fr/statistiques/2540004" target="_blank") Insee - Fichier des prénoms (Édition 2016)
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

    // selectUrl () {
    //   // http://stackoverflow.com/a/1173319
    //   const el = this.$refs['share-url']
    //
    //   if (document.selection) {
    //     var range = document.body.createTextRange()
    //     range.moveToElementText(el)
    //     range.select()
    //   } else if (window.getSelection) {
    //     const range = document.createRange()
    //     range.selectNode(el)
    //     window.getSelection().addRange(range)
    //   }
    // }
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
