import { getDateYMD } from '../../src/utils/date'

describe('date', () => {
  test('getDateYMD 1', async () => {
    const testValue = '1234.12.12'
    expect(getDateYMD(testValue)).toBe(testValue)
  })
  test('getDateYMD 2', async () => {
    const testValue = '1234-12-12'
    expect(getDateYMD(testValue)).toBe('')
  })
  test('getDateYMD 3', async () => {
    const testValue = '1234.12.12 12:12:12'
    expect(getDateYMD(testValue)).toBe('1234.12.12')
  })
  test('getDateYMD 4', async () => {
    const testValue = '1234.12.12 test text !@#$$#%%$^%7'
    expect(getDateYMD(testValue)).toBe('1234.12.12')
  })
  test('getDateYMD 5', async () => {
    const testValue = 'test 1234.12.12 test text !@#$$#%%$^%7'
    expect(getDateYMD(testValue)).toBe('')
  })
})
