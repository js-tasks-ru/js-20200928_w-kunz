export default class SortableTable {
  element = null
  subElements = {}

  constructor(header = [], {data = [], sortByDefault = 'title'} = {}) {
    this.header = header
    this.data = [...data]
    this.lastSortField = sortByDefault
    this.render()
    this.initEventListeners()
    this.sort(this.lastSortField, 'asc')
  }

  getArrow(id) {
    return this.lastSortField === id
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
         </span>`
      : ''
  }

  getHeader() {
    return `
      <tr data-element="header" class="sortable-table__row">
        ${this.header.map(item => (`
          <th class="sortable-table__cell" data-id="${item.id}" data-order="asc">
            ${item.title}${this.getArrow(item.id)}
          </th>`))})
        .join('')}
      </tr>`
  }

  getRow(item) {
    return `
    <tr class="sortable-table__row">
      ${this.header.map(headerItem => {
      return headerItem.id === 'images'
        ? `<td class="sortable-table__cell">
               <img class="sortable-table-image" alt="Image" src="${item.images[0]?.url}">
             </td>`
        : `<td class="sortable-table__cell">${item[headerItem.id]}</td>`
    }).join('')}
    </tr>`
  }

  getBody(data) {
    return `
    <tbody data-element="body" class="sortable-table__body">
      ${data.map(item => this.getRow(item)).join('')}
    </tbody>`
  }

  render() {
    const element = document.createElement('div')
    element.innerHTML = `
      <table class="sortable-table">
        <thead class="sortable-table__header">
          ${this.getHeader()}
        </thead>
        ${this.getBody(this.data)}
      </table>`
    this.element = element.firstElementChild
    this.subElements = this.getSubElements(this.element)
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]')
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement
      return accum
    }, {})
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', (e) => {
      const headerItem = e.target.closest('[data-order]')
      if (this.header.find(item => item.id === headerItem.dataset.id).sortable === false) return

      if (this.lastSortField !== headerItem.dataset.id) {
        headerItem.append(this.subElements.arrow)
        this.lastSortField = headerItem.dataset.id
      }
      headerItem.dataset.order = headerItem.dataset.order === 'desc' ? 'asc' : 'desc'

      this.sort(this.lastSortField, headerItem.dataset.order)
    })
  }

  sort(fieldValue, orderValue) {
    const headerItem = this.header.find(item => item.id === fieldValue)
    const data = [...this.data]
    const sortOrder = orderValue === 'desc' ? -1 : 1
    if (headerItem.sortType === 'number') {
      data.sort((a, b) => sortOrder * (a[fieldValue] - b[fieldValue]))
    } else if (headerItem.sortType === 'string') {
      data.sort((a, b) => sortOrder * (a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en'])))
    }
    this.updateBody(data)
  }

  updateBody(data) {
    this.subElements.body.innerHTML = this.getBody(data)
  }

  remove() {
    this.element.remove()
  }

  destroy() {
    this.element = null
    this.subElements = {}
  }
}
