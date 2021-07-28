const palindrome = (word) => {
  if (typeof word === 'undefined') return undefined
  return word.split('')
    .reverse()
    .join('')
}

const average = (array) => {
  if (array.length === 0) return 0
  let sum = 0
  array.forEach(i => {
    sum += i
  })
  return (sum / array.length)
}

module.exports = {
  palindrome,
  average
}
