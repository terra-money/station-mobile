import { NativeModules } from 'react-native'

// Warning. To avoid making duplicate key with wallet name,
// enum string length should NOT be in 5 ~ 20
// AND Don't recommend add to keystore, except wallets-name and bio-auth-data
export enum KeystoreEnum {
  bioAuthData = 'BAD',
}

export type KeystoreType = {
  write(key: string, value: string): void
  read(key: string): Promise<string>
  remove(key: string): void
}

const Keystore: KeystoreType = NativeModules.Keystore

export default Keystore
