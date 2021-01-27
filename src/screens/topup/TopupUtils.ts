import { CommonActions } from '@react-navigation/native'
import { Alert, Linking } from 'react-native'

export const DEBUG_TOPUP = true

export const restoreApp = (
  navigation: any,
  returnScheme: string
): void => {
  Linking.openURL(returnScheme)
    .then(() => gotoDashboard(navigation))
    .catch(() => {
      Alert.alert('Cannot return!')
    })
}
export const gotoDashboard = (navigation: any): void => {
  navigation.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{ name: 'Tabs' }],
    })
  )
}

export const gotoWallet = (navigation: any): void => {
  navigation.replace('AuthMenu')
}
