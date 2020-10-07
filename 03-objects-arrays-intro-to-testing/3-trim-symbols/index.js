/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (string === '') return ''
  const arrayOfSubstrings = []
  let tempString = string[0]
  for (let i = 1; i < string.length; i++) {
    if (string[i] === tempString[0]) {
      tempString += string[i]
    } else {
      arrayOfSubstrings.push(tempString)
      tempString = string[i]
    }
  }
  arrayOfSubstrings.push(tempString)
  return arrayOfSubstrings.reduce((result, subString) => result += subString.slice(0,size),'')
}
