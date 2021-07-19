import { jsonTryParse, getParam } from '../../src/utils/util'

describe('util', () => {
  describe('jsonTryParse', () => {
    test('return undefined if param is worng data', () => {
      expect(jsonTryParse('')).toBe(undefined)
      expect(jsonTryParse('test')).toBe(undefined)
      expect(jsonTryParse('{test}')).toBe(undefined)
      expect(jsonTryParse('{1}')).toBe(undefined)
    })

    test('success parse', () => {
      expect(jsonTryParse('0')).toBe(0)
      expect(jsonTryParse('{}')).toStrictEqual({})
      expect(jsonTryParse('{"test":1}')).toStrictEqual({ test: 1 })
      expect(jsonTryParse('[]')).toStrictEqual([])
    })
  })

  describe('getParam', () => {
    test('success with no query http url', () => {
      const url = 'https://naver.com'
      expect(getParam({ url, key: '' })).toBe('')
      expect(getParam({ url, key: 'test' })).toBe('')
    })

    test('success with query http url', () => {
      const url = 'https://naver.com?test=1'
      expect(getParam({ url, key: 'test' })).toBe('1')
      expect(getParam({ url, key: 'empty' })).toBe('')
    })

    test('success with no query linking url ', () => {
      const url = 'terrastation://path/'
      expect(getParam({ url, key: 'test' })).toBe('')
      expect(getParam({ url, key: 'empty' })).toBe('')
    })

    test('success with query linking url case 1', () => {
      const url = 'terrastation://path?test=1'
      expect(getParam({ url, key: 'test' })).toBe('1')
      expect(getParam({ url, key: 'empty' })).toBe('')
    })

    test('success with query linking url case 2', () => {
      const url = 'terrastation://path/?test=1'
      expect(getParam({ url, key: 'test' })).toBe('1')
      expect(getParam({ url, key: 'empty' })).toBe('')
    })
  })
})
