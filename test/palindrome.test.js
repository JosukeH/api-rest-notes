const { palindrome } = require('../utility')

describe('palindrome tests', () => {
  test('palindrome of carlos ', () => {
    const result = palindrome('carlos')

    expect(result).toBe('solrac')
  })

  test('palindrome of undefined', () => {
    const result = palindrome()

    expect(result).toBeUndefined()
  })

  test('palindrome of empty string', () => {
    const result = palindrome('')

    expect(result).toBe('')
  })
})
