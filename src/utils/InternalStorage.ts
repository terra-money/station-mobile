import AsyncStorage from '@react-native-community/async-storage'

const ONBOARDING_KEY = 'skip_onboarding'

export const getSkipOnboarding = async (
  set: (v: boolean | null) => any
) => {
  await AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
    value === null ? set(false) : set(Boolean(value))
  })
}

export const setSkipOnboarding = async (v: string | boolean) => {
  await AsyncStorage.setItem(ONBOARDING_KEY, v.toString())
}
