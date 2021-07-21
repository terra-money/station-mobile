import { NativeModules, Platform } from 'react-native'

// Warning. To avoid making duplicate key with wallet name,
// enum string length should NOT be in 5 ~ 20
// AND Don't recommend add to keystore, except wallets-name and bio-auth-data
export enum KeystoreEnum {
  AuthData = 'AD',
}

export type KeystoreType = {
  write(key: string, value: string): void
  read(key: string): Promise<string>
  remove(key: string): void
  migratePreferences(key: string): Promise<void>
}

const Keystore: KeystoreType = NativeModules.Keystore

// Prevent Crashing App from native exception
export default {
  write: (key: string, value: string): boolean => {
    try {
      Keystore.write(key, value)
      return true
    } catch {
      return false
    }
  },
  read: async (key: string): Promise<string> => {
    try {
      return await Keystore.read(key)
    } catch {
      return ''
    }
  },
  remove: (key: string): boolean => {
    try {
      Keystore.remove(key)
      return true
    } catch {
      return false
    }
  },
  migratePreferences: async (key: string): Promise<void> => {
    try {
      Platform.OS === 'android' &&
        (await Keystore.migratePreferences(key))
    } catch {}
  },
}
