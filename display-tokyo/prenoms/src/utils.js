import * as d3 from 'd3'
import _ from 'lodash'

const colorScales = {
  m: d3.scaleOrdinal().range(['#4c5d91', '#4c92b9', '#53a488', '#a5ad5c']),
  f: d3.scaleOrdinal().range(['#a15599', '#d57599', '#b98c6f', '#e0da2f']),
  en: d3.scaleOrdinal().range(['#4c5d91', '#4c92b9', '#53a488', '#a5ad5c']),
  fr: d3.scaleOrdinal().range(['#a15599', '#d57599', '#b98c6f', '#e0da2f']),
  de: d3.scaleOrdinal().range(['#4c5d91', '#4c92b9', '#53a488', '#a5ad5c']),
  es: d3.scaleOrdinal().range(['#a15599', '#d57599', '#b98c6f', '#e0da2f']),
  it: d3.scaleOrdinal().range(['#4c5d91', '#4c92b9', '#53a488', '#a5ad5c']),
  la: d3.scaleOrdinal().range(['#a15599', '#d57599', '#b98c6f', '#e0da2f']),
  ge: d3.scaleOrdinal().range(['#4c5d91', '#4c92b9', '#53a488', '#a5ad5c']),
  el: d3.scaleOrdinal().range(['#a15599', '#d57599', '#b98c6f', '#e0da2f']),
  ru: d3.scaleOrdinal().range(['#4c5d91', '#4c92b9', '#53a488', '#a5ad5c']),
  pt: d3.scaleOrdinal().range(['#a15599', '#d57599', '#b98c6f', '#e0da2f']),
  ja: d3.scaleOrdinal().range(['#4c5d91', '#4c92b9', '#53a488', '#a5ad5c'])
}

export const years = _.range(1950, 2021)

export function forenameColor (d) {
  return colorScales[d.sex](d.forename)
}
export const fullRange = d3.extent(years)

export const defaultDuration = 750

export function maxBirthsCount (forenames, range) {
  return _(forenames)
    .flatMap(d =>
      _(d.births)
        .filter(({ year }) => year >= range.from && year <= range.to)
        .map('births')
        .max()
    )
    .max() || 0
}

export const initialRange = { from: years[0], to: _.last(years) + 1 }
