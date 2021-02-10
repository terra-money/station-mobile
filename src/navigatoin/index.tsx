import React, { ReactElement, useEffect, useState } from 'react'
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
  const [linkingUrl, setLinkingUrl] = useState('')
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
      linkingUrl && Linking.openURL(linkingUrl)
    }
  }, [isFromAutoLogout])

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) {
        setLinkingUrl(url)
      } else {
        Linking.addEventListener('url', ({ url }) => {
          setLinkingUrl(url)
        })
      }
    })
  }, [])

  return (
    <NavigationContainer theme={TerraTheme} linking={linking}>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}
export default Navigator
