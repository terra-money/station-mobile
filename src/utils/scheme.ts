import preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'
import { Linking } from 'react-native'

import { tryNewURL } from './util'

export const parseDynamicLinkURL = (
  value: string
): URL | undefined => {
  const url = tryNewURL(value)
  const link = url?.searchParams.get('link')
  if (link) {
    return tryNewURL(link)
  }
}

export const storeScheme = (url: string): void => {
  if (url && url !== '') {
    preferences.setString(PreferencesEnum.scheme, url)
  }
}

export const loadScheme = (url: string): void => {
  if (url && url !== '') {
    try {
      Linking.openURL(url)
    } finally {
      preferences.setString(PreferencesEnum.scheme, '')
    }
  }
}
