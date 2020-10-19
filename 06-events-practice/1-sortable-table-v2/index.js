export default class SortableTable {
  element = null
  subElements = {}

  constructor(header = [], {data = [], sortByDefault = 'title' } = {}) {
    this.header = header
    this.data = [...data]
    this.sortOptions = {
      lastSortField: sortByDefault,
      lastSortOrder: 'desc'
    }
    this.render()
    this.initEventListeners()
    this.sort(this.sortOptions.lastSortField, this.sortOptions.lastSortOrder)
  }

  getHeader() {
    return `
    <thead data-element="header" class="sortable-table__header">
      <tr class="sortable-table__row">
        ${this.header.map(item => {
          let searchIcon = ''
          if (this.sortOptions.lastSortField === item.id) {
             searchIcon = this.sortOptions.lastSortOrder === 'asc' ?
                 `<span class="sortable-table__sort-arrow">▲</span>`
               : `<span class="sortable-table__sort-arrow">▼</span>`
          }
          return `
            <th class="sortable-table__cell" data-id="${item.id}">
              ${item.title} ${searchIcon}
            </th>`}).join('')}
      </tr>
    </thead>`
  }

  getRow(item) {
    return `
    <tr class="sortable-table__row">
      ${this.header.map(headerItem => {
        if (headerItem.template)
          return `
            <td class="sortable-table__cell">
              <img class="sortable-table-image" alt="Image" src="${item.images[0]?.url}">
            </td>`
        else
          return `<td class="sortable-table__cell">${item[headerItem.id]}</td>`
      }
    ).join('')}
    </tr>
    `
  }

  getBody(data) {
    return `
    <tbody data-element="body">
      ${data.map(item => this.getRow(item)).join('')}
    </tbody>
    `
  }

  render() {
    const element = document.createElement('div')
    element.innerHTML = `
      <table class="sortable-table">
        ${this.getHeader()}
        ${this.getBody(this.data)}
      </table>
    `
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
    const header = this.subElements.header
    header.addEventListener('click', (e) => {
      if (e.target.tagName !== 'TH') return
      if (this.sortOptions.lastSortField !== e.target.dataset.id) {
        this.sortOptions.lastSortField = e.target.dataset.id
        this.sortOptions.lastSortOrder = 'asc'
      } else {
        this.sortOptions.lastSortOrder = this.sortOptions.lastSortOrder === 'desc' ? 'asc' : 'desc'
      }
        this.sort(this.sortOptions.lastSortField, this.sortOptions.lastSortOrder)
    })
  }

  sort(fieldValue, orderValue) {
    const headerItem = this.header.find(item => item.id === fieldValue)
    if (headerItem.sortable === false) return
    const data = [...this.data]

    const sortOrder = orderValue === 'desc' ? -1 : 1
    if (headerItem.sortType === 'number') {
      data.sort((a, b) => sortOrder * (a[fieldValue] - b[fieldValue]))
    } else if (headerItem.sortType === 'string') {
      data.sort((a, b) => sortOrder * (a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en'])))
    }
    this.update(data)
  }

  update(data) {
    this.subElements.header.innerHTML = this.getHeader()
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
