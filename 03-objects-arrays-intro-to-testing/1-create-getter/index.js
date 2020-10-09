/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  if (typeof path !== 'string' || path === '') return
  const properties = path.split('.')
  return obj => {
    let tempProperty = {...obj}
    for (let property of properties) {
      if (!tempProperty[property]) return
      tempProperty = tempProperty[property]
    }
    return tempProperty
  }
}
