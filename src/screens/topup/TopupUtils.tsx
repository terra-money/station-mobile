import React from 'react'
import { CommonActions } from '@react-navigation/native'
import { LCDClient } from '@terra-money/terra.js'
import { ReactElement } from 'react'
import { ActivityIndicator, Alert, Linking, View } from 'react-native'

export const DEBUG_TOPUP = true

export const chain = {
  columbus: {
    chainID: 'columbus-4',
    URL: 'https://lcd.terra.dev',
  },
  tequila: {
    chainID: 'tequila-0004',
    URL: 'https://tequila-lcd.terra.dev',
  },
}

export const lcdClient = new LCDClient({
  chainID: chain.tequila.chainID,
  URL: chain.tequila.URL,
})

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

export const onPressComplete = (
  navigation: any,
  returnScheme: string
): void => {
  restoreApp(navigation, returnScheme)
}

export const LoadingIndicator = (): ReactElement => (
  <View
    style={{
      position: 'absolute',
      flex: 1,
      width: '100%',
      height: '100%',
      alignContent: 'center',
      justifyContent: 'center',
    }}
  >
    <ActivityIndicator size="large" color="#000" />
  </View>
)
