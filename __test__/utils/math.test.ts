import { setComma, delComma } from '../../src/utils/math'

describe('math', () => {
  test('setComma', () => {
    expect(setComma(0)).toBe('0')
    expect(setComma(1000)).toBe('1,000')
    expect(setComma('1000')).toBe('1,000')
    expect(setComma('1000.00')).toBe('1,000.00')
    expect(setComma('10000000.00')).toBe('10,000,000.00')
  })

  test('delComma', () => {
    expect(delComma(0)).toBe('0')
    expect(delComma(1000)).toBe('1000')
    expect(delComma('1,000')).toBe('1000')
    expect(delComma('1,000.00')).toBe('1000.00')
    expect(delComma('10,000,000.00')).toBe('10000000.00')
  })
})
