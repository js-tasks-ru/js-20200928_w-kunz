/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return obj => {
    if (typeof path !== 'string' || path === '') return undefined
    const properties = path.split('.')
    let tempProperty = {...obj}
    while (properties.length) {
      if (!tempProperty[properties[0]]) return undefined
      tempProperty = tempProperty[properties.shift()]
    }
    return tempProperty
  }
}
