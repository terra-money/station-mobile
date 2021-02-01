import { NativeModules } from 'react-native'

export enum PreferencesEnum {
  settings = 'settings',
  onboarding = 'skipOnboarding',
  useBioAuth = 'useBioAuth',
  wallets = 'wallets',
}

export type PreferencesType = {
  setString(key: string, val: string): void
  getString(key: string): Promise<string>
  setBool(key: string, val: boolean): void
  getBool(key: string): Promise<boolean>
  remove(key: string): void
  clear(): void
}

const Preferences: PreferencesType = NativeModules.Preferences

export default Preferences
