import { mergeRight as merge, omit } from 'ramda'

import { Settings } from '../types/settings'
import preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'
import { getAuthDataValue } from './authData'

const getSettings = async (): Promise<Settings> => {
  const settings = await preferences.getString(
    PreferencesEnum.settings
  )
  return settings ? JSON.parse(settings) : {}
}

const setSettings = async (
  next: Partial<Settings>
): Promise<void> => {
  const settings = await getSettings()
  preferences.setString(
    PreferencesEnum.settings,
    JSON.stringify(merge(settings, next))
  )
}

const deleteSettings = async (
  keys: (keyof Settings)[]
): Promise<void> => {
  const settings = await getSettings()
  preferences.setString(
    PreferencesEnum.settings,
    JSON.stringify(omit(keys, settings))
  )
}

const clearSettings = (): void => {
  preferences.clear()
}

// interface of setting
// For Setting page
export const settings = {
  get: getSettings,
  set: setSettings,
  delete: deleteSettings,
  clear: clearSettings,
}

export const getSkipOnboarding = async (): Promise<boolean> => {
  const onboarding = await preferences.getBool(
    PreferencesEnum.onboarding
  )
  return onboarding ? onboarding : false
}

export const setSkipOnboarding = async (
  skip: boolean
): Promise<void> => {
  preferences.setBool(PreferencesEnum.onboarding, skip)
}

export const setUseBioAuth = async ({
  isUse,
}: {
  isUse: boolean
}): Promise<void> => {
  preferences.setBool(PreferencesEnum.useBioAuth, isUse)
}

export const getIsUseBioAuth = async (): Promise<boolean> =>
  preferences.getBool(PreferencesEnum.useBioAuth)

export const getBioAuthPassword = async ({
  walletName,
}: {
  walletName: string
}): Promise<string> => {
  const authDataValue = await getAuthDataValue(walletName)

  return authDataValue ? authDataValue.password : ''
}
