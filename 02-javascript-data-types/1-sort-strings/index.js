/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const sorted = [...arr]
  const ascendingOrDescending = param === 'desc' ? -1 : 1
  // Eсли аргумент @param функции передан, но он отличается от 'desc' или 'asc', сортировка будет проведена в восходящем прорядке (как 'asc')
  sorted.sort((a, b) => ascendingOrDescending * a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper' }))
  return sorted
}
