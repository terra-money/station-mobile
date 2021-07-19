import { decrypt, encrypt } from '../../src/utils/crypto'

describe('crypto', () => {
  test('decrypt, encrypt 1', () => {
    const value = 'a'
    const password = 'b'
    expect(decrypt(encrypt(value, password), password)).toBe(value)
  })
  test('decrypt, encrypt 2', () => {
    const value = ''
    const password = ''
    expect(decrypt(encrypt(value, password), password)).toBe(value)
  })
  test('decrypt, encrypt 3', () => {
    const value = '!@#$%^&*()1234567890'
    const password = '0987654321)(*&^%$#@!'
    expect(decrypt(encrypt(value, password), password)).toBe(value)
  })
})
