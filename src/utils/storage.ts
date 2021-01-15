import { NativeModules } from 'react-native'
import CryptoJS from 'crypto-js'
import { mergeRight as merge, omit } from 'ramda'
import { Wallet } from '@terra-money/use-native-station'
import { Settings } from '../types/settings'
import preferences from 'nativeModules/preferences'

const { Keystore } = NativeModules

export const { encrypt, decrypt } = CryptoJS.AES

/* keys */
const SEP = ','
export const loadNames = async (): Promise<string[]> => {
  const names = await preferences.getString('names')
  return names ? JSON.parse(names) : []
}

export const loadKey = async (name: string): Promise<Key> => {
  const key = await Keystore.read(name)
  return JSON.parse(key)
}

export const storeKeys = (keys: Key[]): void => {
  const names = keys.map(({ name }) => name)
  preferences.setString('names', JSON.stringify(names))
  keys.forEach((key) =>
    Keystore.write(key.name, JSON.stringify(keys))
  )
}

export const getStoredWallet = async (
  name: string,
  password: string
): Promise<Wallet> => {
  const key = await Keystore.read(name)

  if (!key) throw new Error('Key with that name does not exist')

  try {
    const parsed = JSON.parse(key)
    return decrypt(parsed.wallet, password) as Wallet
  } catch (err) {
    throw new Error('Incorrect password')
  }
}

type Params = { name: string; password: string; wallet: Wallet }

export const importKey = async ({
  name,
  password,
  wallet,
}: Params): Promise<void> => {
  const names = await loadNames()

  if (names.includes(name))
    throw new Error('Key with that name already exists')

  const encrypted = encrypt(
    JSON.stringify(wallet),
    password
  ).toString()

  if (!encrypted) throw new Error('Encryption error occurred')

  const key: Key = {
    name,
    address: wallet.terraAddress,
    wallet: encrypted,
  }

  preferences.setString('names', JSON.stringify([...names, name]))
  Keystore.write(name, JSON.stringify(key))
}

export const clearKeys = async (): Promise<void> => {
  const names = await preferences.getString('names')
  await names
    .split(SEP)
    .forEach((name: string) => Keystore.remove(name))
}

export const testPassword = (
  { name, password }: { name: string; password: string },
  keys: Key[]
): boolean => {
  const key = keys.find((key) => key.name === name)

  if (!key) throw new Error('Key with that name does not exist')

  try {
    decrypt(key.wallet, password).toString(CryptoJS.enc.Utf8)
    return true
  } catch (error) {
    return false
  }
}

// Settings
const SETTINGS = 'settings'

const getSettings = async (): Promise<Settings> => {
  const settings = await preferences.getString(SETTINGS)
  return settings ? JSON.parse(settings) : {}
}

const setSettings = async (
  next: Partial<Settings>
): Promise<void> => {
  const settings = await getSettings()
  preferences.setString(
    SETTINGS,
    JSON.stringify(merge(settings, next))
  )
}

const deleteSettings = async (
  keys: (keyof Settings)[]
): Promise<void> => {
  const settings = await getSettings()
  preferences.setString(
    SETTINGS,
    JSON.stringify(omit(keys, settings))
  )
}

export const clearSettings = (): void => {
  preferences.clear()
}

export const settings = {
  get: getSettings,
  set: setSettings,
  delete: deleteSettings,
  clear: clearSettings,
}

// Onboarding
const ONBOARDING = 'skip_onboarding'

export const getSkipOnboarding = async (): Promise<boolean> => {
  const onboarding = await preferences.getBool(ONBOARDING)
  return onboarding ? onboarding : false
}

export const setSkipOnboarding = async (
  skip: boolean
): Promise<void> => {
  preferences.setBool(ONBOARDING, skip)
}

const USE_BIO_AUTH = 'use_bio_auth'

export const setUseBioAuth = async (use: boolean): Promise<void> => {
  preferences.setBool(USE_BIO_AUTH, use)
}

export const getUseBioAuth = async (): Promise<boolean> =>
  preferences.getBool(USE_BIO_AUTH)
