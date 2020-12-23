import CryptoJS from "crypto-js"

const keySize = 256
const iterations = 100

export const encrypt = (message: string, password: string): string => {
  try {
    const salt = CryptoJS.lib.WordArray.random(128 / 8)
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: keySize / 32,
      iterations: iterations,
    })

    const iv = CryptoJS.lib.WordArray.random(128 / 8)
    const encrypted = CryptoJS.AES.encrypt(message, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    })

    const transitmessage =
      salt.toString() + iv.toString() + encrypted.toString()

    return transitmessage
  } catch (error) {
    return ""
  }
}

export const decrypt = (transitmessage: string, password: string): string => {
  try {
    const salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32))
    const iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
    const encrypted = transitmessage.substring(64)
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: keySize / 32,
      iterations: iterations,
    })

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    })

    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    return ""
  }
}