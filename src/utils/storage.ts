import { NativeModules } from 'react-native'
import CryptoJS from 'crypto-js'
import { mergeRight as merge, omit } from 'ramda'
import { Wallet } from '@terra-money/use-native-station'

const { Preferences, Keystore } = NativeModules
const { encrypt, decrypt } = CryptoJS.AES

/* keys */
const SEP = ','
export const loadNames = async (): Promise<string[]> => {
  const names = await Preferences.getString('names')
  return names ? JSON.parse(names) : []
}

export const loadKey = async (name: string): Promise<Key> => {
  const key = await Keystore.read(name)
  return JSON.parse(key)
}

export const storeKeys = (keys: Key[]) => {
  const names = keys.map(({ name }) => name)
  Preferences.setString('names', JSON.stringify(names))
  keys.forEach((key) => Keystore.write(key.name, JSON.stringify(keys)))
}

export const getStoredWallet = async (
  name: string,
  password: string
): Promise<Wallet> => {
  const key = await Keystore.read(name)

  if (!key) throw new Error('Key with that name does not exist')

  try {
    return decrypt(key.wallet, password) as Wallet
  } catch (err) {
    throw new Error('Incorrect password')
  }
}

type Params = { name: string; password: string; wallet: Wallet }
export const importKey = async ({ name, password, wallet }: Params) => {
  const names = await loadNames()

  if (names.includes(name)) throw new Error('Key with that name already exists')

  const encrypted = encrypt(JSON.stringify(wallet), password).toString()

  if (!encrypted) throw new Error('Encryption error occurred')

  const key: Key = {
    name,
    address: wallet.terraAddress,
    wallet: encrypted,
  }

  Preferences.setString('names', JSON.stringify([...names, name]))
  Keystore.write(name, JSON.stringify(key))
}

/*
export const findName = (address: string): string | undefined => {
  const keys = loadKeys()
  const key = keys.find(key => key.address === address)
  return key ? key.name : undefined
}
*/
export const testPassword = (
  { name, password }: { name: string; password: string },
  keys: Key[]
) => {
  const key = keys.find((key) => key.name === name)

  if (!key) throw new Error('Key with that name does not exist')

  try {
    decrypt(key.wallet, password).toString(CryptoJS.enc.Utf8)
    return true
  } catch (error) {
    return false
  }
}
/*
// Settings
const SETTINGS = 'settings'

const getSettings = (): Settings => {
  const settings = localStorage?.getItem(SETTINGS)
  return settings ? JSON.parse(settings) : {}
}

const setSettings = (next: Partial<Settings>): void => {
  const settings = getSettings()
  localStorage?.setItem(SETTINGS, JSON.stringify(merge(settings, next)))
}

const deleteSettings = (keys: (keyof Settings)[]): void => {
  const settings = getSettings()
  localStorage?.setItem(SETTINGS, JSON.stringify(omit(keys, settings)))
}

export const localSettings = {
  get: getSettings,
  set: setSettings,
  delete: deleteSettings
}
*/

export const clearSettings = (): void => {
  Preferences.clear()
}

export const clearKeys = async (): Promise<void> => {
  const names = await Preferences.getString('names')
  await names.split(SEP).forEach((name: string) => Keystore.remove(name))
}
