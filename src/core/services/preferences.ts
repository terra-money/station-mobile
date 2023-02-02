import { NativeModules } from 'react-native'

export enum PreferencesEnum {
  settings = 'settings',
  onboarding = 'skipOnboarding',
  useBioAuth = 'useBioAuth',
  firstRun = 'firstRun',
  walletHideSmall = 'walletHideSmall',
  scheme = 'scheme',
  walletConnectSession = 'walletConnectSession',
  stakingFilter = 'stakingFilter',
  tokens = 'tokens',
}

export type PreferencesType = {
  setString(key: PreferencesEnum, val: string): void
  getString(key: PreferencesEnum): Promise<string>
  setBool(key: PreferencesEnum, val: boolean): void
  getBool(key: PreferencesEnum): Promise<boolean>
  remove(key: PreferencesEnum): void
  clear(): void
}

const Preferences: PreferencesType = NativeModules.Preferences

export default Preferences
