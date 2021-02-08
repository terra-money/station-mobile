import React from 'react'
import { CommonActions } from '@react-navigation/native'
import { LCDClient } from '@terra-money/terra.js'
import { ReactElement } from 'react'
import { ActivityIndicator, Linking, View } from 'react-native'

export const DEBUG_TOPUP = false

export const getLCDClient = (
  chainID: string,
  URL: string
): LCDClient => {
  return new LCDClient({
    chainID,
    URL,
  })
}

export const restoreApp = async (
  navigation: any,
  returnScheme: string,
  alert: any
): Promise<void> => {
  try {
    await Linking.openURL(returnScheme)
  } catch (e) {
    alert({ title: 'Unexpected error', desc: e.toString() })
  } finally {
    gotoDashboard(navigation)
  }
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
