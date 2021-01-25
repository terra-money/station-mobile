import { NativeModules } from 'react-native'

export type Keystore = {
  write(key: string, value: string): void
  read(key: string): Promise<string>
  remove(key: string): void
}

const Keystore: Keystore = NativeModules.Keystore

export default Keystore
