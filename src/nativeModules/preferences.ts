import { NativeModules } from 'react-native'

const Preferences: {
  setString(key: string, val: string): void
  getString(key: string): Promise<string>
  setBool(key: string, val: boolean): void
  getBool(key: string): Promise<boolean>
  remove(key: string): void
  clear(): void
} = NativeModules.Preferences

export default Preferences
