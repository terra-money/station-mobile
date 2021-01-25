import { NativeModules } from 'react-native'

export type Preferences = {
  setString(key: string, val: string): void
  getString(key: string): Promise<string>
  setBool(key: string, val: boolean): void
  getBool(key: string): Promise<boolean>
  remove(key: string): void
  clear(): void
}

const Preferences: Preferences = NativeModules.Preferences

export default Preferences
