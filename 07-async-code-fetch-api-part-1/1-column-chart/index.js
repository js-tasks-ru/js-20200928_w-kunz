import fetchJson from './utils/fetch-json.js'

export default class ColumnChart {
  chartHeight = 50
  element = null
  subElements = {}

  constructor({data = [], url = '', range = {}, label = '', link = '', value = null} = {}) {
    this.data = data
    this.url = 'https://course-js.javascript.ru/' + url
    this.range = range
    this.label = label
    this.link = link
    this.value = value
    this.render()
    this.update(this.range.from, this.range.to)
  }

  getBody(data) {
    const maxValue = Math.max(...data)
    return `${data.map(item => `
                <div data-tooltip="${Math.round(item / maxValue * 100)}%" style="--value:${Math.floor(item / maxValue * this.chartHeight)};"></div>
              `).join('')}`
  }

  render() {
    const element = document.createElement('div')
    element.innerHTML = `
      <div class="column-chart" style="--chart-height:${this.chartHeight};">
        <div class="column-chart__title">
          <span>Total ${this.label}</span>
          ${(this.link) && `<a class="column-chart__link" href="${this.link}">View all</a>`}
        </div>
        <div class="column-chart__container">
          <div class="column-chart__header">${this.value}</div>
          <div data-element="body" class="column-chart__chart">
            ${this.getBody(Object.values(this.data))}
          </div>
        </div>
      </div>
    `
    this.element = element.firstElementChild
    if (Object.entries(this.data).length === 0) {
      this.element.classList.add('column-chart_loading')
    }
    this.subElements = this.getSubElements(this.element)
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]')
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement
      return accum
    }, {})
  }

  destroy() {
    this.element.remove()
  }

  remove() {
    this.element.remove()
  }

  async update(dateFrom, dateTo) {
    const url = new URL(this.url)
    url.searchParams.set('from', dateFrom)
    url.searchParams.set('to', dateTo)
    this.data = await fetchJson(url)
    this.subElements.body.innerHTML = this.getBody(Object.values(this.data))
    if (Object.values(this.data).length !== 0) {
      this.element.classList.remove('column-chart_loading')
    }
  }
}
