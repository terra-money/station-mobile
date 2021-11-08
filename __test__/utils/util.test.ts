import UTIL from '../../src/consts/util'

describe('util', () => {
  describe('jsonTryParse', () => {
    test('return undefined if param is worng data', () => {
      expect(UTIL.jsonTryParse('')).toBe(undefined)
      expect(UTIL.jsonTryParse('test')).toBe(undefined)
      expect(UTIL.jsonTryParse('{test}')).toBe(undefined)
      expect(UTIL.jsonTryParse('{1}')).toBe(undefined)
    })

    test('success parse', () => {
      expect(UTIL.jsonTryParse('0')).toBe(0)
      expect(UTIL.jsonTryParse('{}')).toStrictEqual({})
      expect(UTIL.jsonTryParse('{"test":1}')).toStrictEqual({
        test: 1,
      })
      expect(UTIL.jsonTryParse('[]')).toStrictEqual([])
    })
  })

  describe('getParam', () => {
    test('success with no query http url', () => {
      const url = 'https://naver.com'
      expect(UTIL.getParam({ url, key: '' })).toBe('')
      expect(UTIL.getParam({ url, key: 'test' })).toBe('')
    })

    test('success with query http url', () => {
      const url = 'https://naver.com?test=1'
      expect(UTIL.getParam({ url, key: 'test' })).toBe('1')
      expect(UTIL.getParam({ url, key: 'empty' })).toBe('')
    })

    test('success with no query linking url ', () => {
      const url = 'terrastation://path/'
      expect(UTIL.getParam({ url, key: 'test' })).toBe('')
      expect(UTIL.getParam({ url, key: 'empty' })).toBe('')
    })

    test('success with query linking url case 1', () => {
      const url = 'terrastation://path?test=1'
      expect(UTIL.getParam({ url, key: 'test' })).toBe('1')
      expect(UTIL.getParam({ url, key: 'empty' })).toBe('')
    })

    test('success with query linking url case 2', () => {
      const url = 'terrastation://path/?test=1'
      expect(UTIL.getParam({ url, key: 'test' })).toBe('1')
      expect(UTIL.getParam({ url, key: 'empty' })).toBe('')
    })
  })

  test('setComma', () => {
    expect(UTIL.setComma()).toBe('')
    expect(UTIL.setComma(0)).toBe('0')
    expect(UTIL.setComma(1000)).toBe('1,000')
    expect(UTIL.setComma('1000')).toBe('1,000')
    expect(UTIL.setComma('1000.00')).toBe('1,000.00')
    expect(UTIL.setComma('10000000.00')).toBe('10,000,000.00')
  })

  test('delComma', () => {
    expect(UTIL.delComma(0)).toBe('0')
    expect(UTIL.delComma(1000)).toBe('1000')
    expect(UTIL.delComma('1,000')).toBe('1000')
    expect(UTIL.delComma('1,000.00')).toBe('1000.00')
    expect(UTIL.delComma('10,000,000.00')).toBe('10000000.00')
  })
})
