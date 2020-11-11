const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']

export default class RangePicker {
  element = null
  subElements = {}
  bothDaysSelected = true

  constructor({from = new Date(), to = new Date()} = {}) {
    if (to < from) to = from
    this.range = {from, to}
    this.selectorStatus = {
      monthLeftDate: this.range.from,
      monthRightDate: this.getNextMonthDate(this.range.from)
    }
    this.render()
  }

  render() {
    const element = document.createElement('div')
    element.innerHTML = this.template
    this.element = element.firstElementChild
    this.subElements = this.getSubElements(this.element)
    this.updateInput(this.range)
    this.initEventListeners()
  }

  get template() {
    return `
      <div class="rangepicker">
        <div class="rangepicker__input" data-element="input">
          <span data-element="from"></span> -
          <span data-element="to"></span>
        </div>
        <div class="rangepicker__selector" data-element="selector"></div>
      </div>`
  }

  getSelector() {
    return `
      <div class="rangepicker__selector-arrow"></div>
      <div class="rangepicker__selector-control-left"></div>
      <div class="rangepicker__selector-control-right"></div>
      <div class="rangepicker__calendar" data-element="calendarLeft">
          ${this.getMonthCalendar(this.selectorStatus.monthLeftDate)}
      </div>
      <div class="rangepicker__calendar" data-element="calendarRight">
          ${this.getMonthCalendar(this.selectorStatus.monthRightDate)}
      </div>`
  }

  getMonthCalendar(date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    let firstWeekDay = new Date(year, month, 1).getDay()
    if (firstWeekDay === 0) firstWeekDay = 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return `
      <div class="rangepicker__month-indicator">
        <time datetime="${months[month]}">${months[month]}</time>
      </div>
      <div class="rangepicker__day-of-week">
        <div>Пн</div>
        <div>Вт</div>
        <div>Ср</div>
        <div>Чт</div>
        <div>Пт</div>
        <div>Сб</div>
        <div>Вс</div>
      </div>
      <div class="rangepicker__date-grid">

        ${Array(daysInMonth).fill(true).map((_, index) => {
      const currentDay = index + 1
      return `<button
                      type="button"
                      class="${this.getClassNames(year, month, currentDay)}"
                      data-date="${new Date(year, month, currentDay).toISOString()}"
                      ${(currentDay === 1) ? `style="--start-from: ${firstWeekDay}"` : ''}
                  >${currentDay}</button>
                 `
    })
      .join('')}
      </div>`
  }

  getClassNames(year, month, day) {
    const {from, to} = this.range
    const date = new Date(year, month, day)
    const classNames = ['rangepicker__cell']

    if (date.getTime() === from.getTime()) {
      classNames.push('rangepicker__selected-from')
    }
    if (to && date.getTime() === to.getTime()) {
      classNames.push('rangepicker__selected-to')
    }
    if (to && date.getTime() > from.getTime() && date.getTime() < to.getTime()) {
      classNames.push('rangepicker__selected-between')
    }
    return classNames.join(' ')
  }

  initEventListeners() {
    document.addEventListener('click', this.clickHandler, true)
    document.addEventListener('date-select', this.updateInput)
  }

  initArrowsListeners() {
    const arrowLeft = this.element.querySelector('.rangepicker__selector-control-left')
    const arrowRight = this.element.querySelector('.rangepicker__selector-control-right')
    arrowLeft.addEventListener('click', this.clickPreviousMonth)
    arrowRight.addEventListener('click', this.clickNextMonth)
  }

  clickHandler = (e) => {
    const input = e.target.closest('[data-element="input"]')
    if (input) {
      this.toggleSelector()
      return
    }

    const selector = e.target.closest('[data-element="selector"]')
    if (!selector) {
      this.toggleSelector()
      return
    }

    const calenderDay = e.target.closest('.rangepicker__cell')
    if (calenderDay) {
      if (this.bothDaysSelected) {
        this.range.from = new Date(calenderDay.dataset.date)
        this.range.to = null
        this.subElements.selector.innerHTML = this.getSelector()
        this.initArrowsListeners()

      } else {
        this.range.to = new Date(calenderDay.dataset.date)
        if (this.range.to < this.range.from) {
          const temp = this.range.from
          this.range.from = this.range.to
          this.range.to = temp
        }
        this.toggleSelector()
        this.dispatchEvent()
      }

      this.bothDaysSelected = !this.bothDaysSelected
    }
  }

  toggleSelector = () => {
    if (!this.element.classList.contains('rangepicker_open')) {
      this.subElements.selector.innerHTML = this.getSelector()
      this.initArrowsListeners()
    } else {
      this.subElements.selector.innerHTML = ''
    }
    this.element.classList.toggle('rangepicker_open')
  }

    clickPreviousMonth = () => {
    this.selectorStatus.monthRightDate = this.selectorStatus.monthLeftDate
    this.selectorStatus.monthLeftDate = this.getPreviousMonthDate(this.selectorStatus.monthLeftDate)
    document.querySelector('[data-element="calendarLeft"]').innerHTML = this.getMonthCalendar(this.selectorStatus.monthLeftDate)
    document.querySelector('[data-element="calendarRight"]').innerHTML = this.getMonthCalendar(this.selectorStatus.monthRightDate)
  }

  clickNextMonth = () => {
    this.selectorStatus.monthLeftDate = this.selectorStatus.monthRightDate
    this.selectorStatus.monthRightDate = this.getNextMonthDate(this.selectorStatus.monthRightDate)
    document.querySelector('[data-element="calendarLeft"]').innerHTML = this.getMonthCalendar(this.selectorStatus.monthLeftDate)
    document.querySelector('[data-element="calendarRight"]').innerHTML = this.getMonthCalendar(this.selectorStatus.monthRightDate)
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]')
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement
      return accum
    }, {})
  }

  updateInput = () => {
    const {from, to} = this.range
    this.subElements.from.textContent = from.toLocaleDateString('ru')
    this.subElements.to.textContent = to.toLocaleDateString('ru')
  }

  getNextMonthDate(date) {
    const thisMonth = date.getMonth()
    const nextMonthDate = new Date(date)
    nextMonthDate.setMonth(thisMonth + 1)
    return nextMonthDate
  }

  getPreviousMonthDate(date) {
    const thisMonth = date.getMonth()
    const nextMonthDate = new Date(date)
    nextMonthDate.setMonth(thisMonth - 1)
    return nextMonthDate
  }

  dispatchEvent() {
    this.element.dispatchEvent(new CustomEvent('date-select', {
      bubbles: true,
      detail: {
        from: this.range.from,
        to: this.range.to
      }
    }))
  }

  remove() {
    this.element.remove()
  }

  destroy() {
    document.addEventListener('date-select', this.updateInput)
    document.removeEventListener('click', this.clickHandler, true)
    this.remove()
    this.element = null
    this.subElements = {}
  }
}
