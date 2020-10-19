export default class SortableTable {
  element = null
  subElements = {}

  constructor(header = [], {data = []} = {}) {
    this.header = header
    this.data = [...data]
    console.log('constructors', this.data)
    this.render()
  }

  getHeader() {
    return `
    <thead data-element="header" class="sortable-table__header">
      <tr class="sortable-table__row">
        ${this.header.map(item => `<th class="sortable-table__cell">${item.title}</th>`).join('')}
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

  sort(fieldValue, orderValue) {
    const data = [...this.data]
    const sortOrder = orderValue === 'desc' ? -1 : 1
    const headerItem = this.header.find(item => item.id === fieldValue)
    if (headerItem.sortType === 'number') {
      data.sort((a, b) => sortOrder * (a[fieldValue] - b[fieldValue]))
    }
    else if (headerItem.sortType === 'string') {
      data.sort((a, b) => sortOrder * (a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en'])))
    }
    this.update(data)
  }

  update(data) {
    this.subElements.body.innerHTML = this.getBody(data)
  }

  remove() {
    this.element.remove()
  }

  destroy() {
    this.element.remove()
    this.element = null
    this.subElements = {}
  }
}

