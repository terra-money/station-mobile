import { mergeRight as merge, omit } from 'ramda'
import _ from 'lodash'

import { Settings } from '../types/settings'
import preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'
import keystore, { KeystoreEnum } from 'nativeModules/keystore'

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

export const clearSettings = (): void => {
  preferences.clear()
}

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

export const upsertBioAuthPassword = async ({
  password,
  walletName,
}: {
  password: string
  walletName: string
}): Promise<void> => {
  const bioAuthData = await keystore.read(KeystoreEnum.bioAuthData)
  let jsonData: Record<string, string> = {}

  if (_.some(bioAuthData)) {
    jsonData = JSON.parse(bioAuthData)
  }

  jsonData[walletName] = password
  keystore.write(KeystoreEnum.bioAuthData, JSON.stringify(jsonData))
}

export const removeBioAuthPassword = async ({
  walletName,
}: {
  walletName: string
}): Promise<boolean> => {
  try {
    const bioAuthData = await keystore.read(KeystoreEnum.bioAuthData)
    let jsonData: Record<string, string> = {}

    if (_.some(bioAuthData)) {
      jsonData = JSON.parse(bioAuthData)
    }

    keystore.write(
      KeystoreEnum.bioAuthData,
      JSON.stringify(_.omit(jsonData, walletName))
    )

    return true
  } catch {
    return false
  }
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
  const bioAuthData = await keystore.read(KeystoreEnum.bioAuthData)

  if (_.some(bioAuthData)) {
    const jsonData = JSON.parse(bioAuthData)
    return jsonData[walletName]
  }

  return ''
}
