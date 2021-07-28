const { average } = require('../utility')

describe('averages', () => {
  test('average of [1]', () => {
    const test = average([1])
    expect(test).toBe(1)
  })

  test('of many is calculated correctly ', () => {
    expect(average([1, 2, 3, 4, 5, 6, 7])).toBe(4)
  })

  test('whit a empty array', () => {
    expect(average([])).toBe(0)
  })
})
