/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  // Version 1:
  //
  // const newObj = {...obj}
  // for (let field of fields) {
  //   delete newObj[field]
  //   }
  // return newObj

  // Version 2:
  return Object.fromEntries(
    Object.entries(obj)
      .filter(entry => !fields.includes(entry[0]))
  )
};

