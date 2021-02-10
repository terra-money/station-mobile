import React, { ReactElement, useEffect } from 'react'
import { useAuth } from 'use-station/src'
import {
  NavigationContainer,
  DefaultTheme,
  LinkingOptions,
  PathConfigMap,
} from '@react-navigation/native'
import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'
import { useRecoilState } from 'recoil'
import AutoLogoutStore from 'stores/AutoLogoutStore'
import { Linking } from 'react-native'

const TerraTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F9FAFF',
  },
}
const Navigator = (): ReactElement => {
  const { user } = useAuth()
  const [isFromAutoLogout, setIsFromAutoLogout] = useRecoilState(
    AutoLogoutStore.isFromAutoLogout
  )
  const screens: PathConfigMap = user
    ? {
        ConnectView: {
          path: 'connect',
        },
        SendTxView: {
          path: 'sign',
        },
        AutoLogout: {
          path: 'wallet_recover',
        },
      }
    : {
        RecoverWallet: {
          screens: {
            Step2QR: {
              path: 'wallet_recover',
            },
          },
        },
      }

  const linking: LinkingOptions = {
    prefixes: ['terrastation://'],
    config: {
      screens,
    },
  }

  useEffect(() => {
    if (isFromAutoLogout) {
      setIsFromAutoLogout(false)
      Linking.getInitialURL().then((link) => {
        link && Linking.openURL(link)
      })
    }
  }, [isFromAutoLogout])

  return (
    <NavigationContainer theme={TerraTheme} linking={linking}>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}
export default Navigator
