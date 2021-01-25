import { mergeRight as merge, omit } from 'ramda'

import { Settings } from '../types/settings'
import preferences from 'nativeModules/preferences'

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
