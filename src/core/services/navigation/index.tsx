import React from 'react'
import { NavigationContainerRef } from '@react-navigation/core'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer as ReactNavigationContainer } from '@react-navigation/native'
import { RootStackParamList } from './types'
import { useLocalWallet } from '@core/wallet'
import { View } from 'native-base'
import { getPlaygroundRoutes } from '@playground/routes'

const stack = createNativeStackNavigator<RootStackParamList>()

export const navigationContainerRef =
  React.createRef<NavigationContainerRef<RootStackParamList>>()

const { Navigator } = stack

export type Stack = typeof stack

const enableUIPlayground = true

export const NavigationContainer = () => {
  const { loaded: loadedWallet, wallet } = useLocalWallet()

  if (!loadedWallet) return <View></View>

  const availableRoutes = () => {
    if (__DEV__ && enableUIPlayground) {
      return getPlaygroundRoutes(stack)
    }

    if (!wallet) {
      // TODO: Change for onboarding routes
      return getPlaygroundRoutes(stack)
    }

    // TODO: change for all routes
    return getPlaygroundRoutes(stack)
  }

  return (
    <ReactNavigationContainer>
      <Navigator>{availableRoutes()}</Navigator>
    </ReactNavigationContainer>
  )
}
