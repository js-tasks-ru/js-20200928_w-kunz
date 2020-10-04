/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const sorted = [...arr]
  const ascendingOrDescending = param === 'asc' ? 1 : -1
  sorted.sort((a, b) => ascendingOrDescending * a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper' }))
  return sorted
}
