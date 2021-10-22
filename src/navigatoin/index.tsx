import React, {
  ReactElement,
  useEffect,
  useState,
  useRef,
} from 'react'
import { Linking } from 'react-native'
import {
  NavigationContainer,
  DefaultTheme,
  LinkingOptions,
  PathConfigMap,
  NavigationContainerRef,
} from '@react-navigation/native'
import { useRecoilState } from 'recoil'
import _ from 'lodash'

import { UTIL } from 'consts'

import { useAuth } from 'lib'
import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'
import AutoLogoutStore from 'stores/AutoLogoutStore'
import TopupStore from 'stores/TopupStore'

import WalletConnectButton from './WalletConnectButton'
import security from 'utils/security'
import { TxParam } from 'types/tx'
import useLinking from 'hooks/useLinking'

const TerraTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F9FAFF',
  },
}

const Navigator = (): ReactElement => {
  const navigatorRef = useRef<NavigationContainerRef<any>>(null)
  const { user } = useAuth()
  const { openURL } = useLinking()
  const [linkingUrl, setLinkingUrl] = useState('')
  const [isFromAutoLogout, setIsFromAutoLogout] = useRecoilState(
    AutoLogoutStore.isFromAutoLogout
  )
  const [continueSignedTx, setContinueSignedTx] = useRecoilState(
    TopupStore.continueSignedTx
  )

  const screens: PathConfigMap<any> = user
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
        WalletConnect: {
          path: 'wallet_connect',
        },
        WalletConnectConfirm: {
          path: 'wallet_connect_confirm',
          parse: {
            params: (value): TxParam | undefined => {
              const txParamArr = UTIL.jsonTryParse<TxParam[]>(value)
              if (txParamArr && txParamArr.length > 0) {
                return txParamArr[0]
              }
            },
          },
        },
        LinkingSend: {
          path: 'send',
        },
        LinkingWalletConnect: {
          path: 'walletconnect_connect',
        },
        LinkingWalletConnectConfirm: {
          path: 'walletconnect_confirm',
        },
        LinkingError: '*',
      }
    : {
        RecoverWallet: {
          screens: {
            Step2QR: {
              path: 'wallet_recover',
            },
          },
        },
        WalletConnectDisconnected: {
          path: 'walletconnect_confirm',
        },
      }

  const linking: LinkingOptions<any> = {
    prefixes: ['terrastation://'],
    config: {
      screens,
    },
  }

  useEffect(() => {
    if (isFromAutoLogout) {
      setIsFromAutoLogout(false)
      linkingUrl && openURL(linkingUrl)
    }
  }, [isFromAutoLogout])

  useEffect(() => {
    if (continueSignedTx) {
      setContinueSignedTx(false)
      linkingUrl && openURL(linkingUrl)
    }
  }, [continueSignedTx])

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
    <>
      <NavigationContainer
        ref={navigatorRef}
        theme={TerraTheme}
        linking={linking}
        onStateChange={(state): void => {
          const routes = _.clone(state?.routes)
          const currentRouteName = routes?.pop()?.name || ''
          const disableCapture = [
            'NewWallet',
            'SelectWallet',
            'RecoverWallet',
            'ConfirmPassword',
            'SendTxPasswordView',
            'Password',
            'WalletConnectConfirmPassword',
            'ChangePassword',
            'ExportPrivateKey',
            'ExportWallet',
          ].includes(currentRouteName)
          disableCapture
            ? security.disallowScreenCapture()
            : security.allowScreenCapture()
        }}
      >
        {user ? (
          <>
            <MainNavigator />
            <WalletConnectButton navigatorRef={navigatorRef} />
          </>
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
    </>
  )
}
export default Navigator
