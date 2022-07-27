import React, { useState, useEffect, ReactElement, useCallback } from 'react'
import { Platform } from 'react-native'
import { LogBox, View, SafeAreaView, StatusBar, Modal, KeyboardAvoidingView } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import { RecoilRoot, useRecoilValue } from 'recoil'
import RNExitApp from 'react-native-exit-app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AccAddress } from '@terra-money/terra.js'

import {
  useAuthState,
  AuthProvider,
  useConfigState,
  ConfigProvider,
  User,
} from 'lib'

import { UTIL } from 'consts'

import { Settings } from 'types'
import { AppProvider } from './useApp'

import AppNavigator from '../navigatoin'

import useSecurity from 'hooks/useSecurity'
import useNetworks from 'hooks/useNetworks'

import preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'
import keystore, { KeystoreEnum } from 'nativeModules/keystore'

import { getWallets } from 'utils/wallet'
import { getSkipOnboarding, settings } from 'utils/storage'
import { parseDynamicLinkURL } from 'utils/scheme'

import DebugBanner from './DebugBanner'
import OnBoarding from './OnBoarding'
import GlobalTopNotification from './GlobalTopNotification'
import UnderMaintenance from './UnderMaintenance'

import { useAlertViewState } from './AlertView'
import { RN_APIS, WebViewContainer } from './WebViewContainer'
import QRScan from '../components/QrCodeButton/QRScan'
import AppStore from 'stores/AppStore'
import { themes } from 'lib/contexts/useTheme'

LogBox.ignoreLogs(['EventEmitter.removeListener'])

const queryClient = new QueryClient()

let App = ({
  settings: { lang, chain, currency, theme },
  user,
}: {
  settings: Settings
  user?: User[]
}): ReactElement => {
  /* drawer */
  const alertViewProps = useAlertViewState()
  const { networks } = useNetworks()
  const webviewComponentLoaded = useRecoilValue(AppStore.webviewComponentLoaded)

  const chainOption =
    (chain ? networks[chain.name] : networks.mainnet) ||
    networks.mainnet

  /* provider */
  const config = useConfigState({
    lang,
    chain: chainOption,
    currency,
    theme,
  })
  const { current: currentLang = '' } = config.lang
  const { current: currentChainOptions } = config.chain
  const { name: currentChain = '' } = currentChainOptions
  const { current: currentTheme } = config.theme

  const {
    getSecurityErrorMessage,
    securityCheckFailed,
  } = useSecurity()

  /* onboarding */
  const [showOnBoarding, setshowOnBoarding] = useState<boolean>(false)

  const webviewInstance = useRecoilValue(AppStore.webviewInstance)

  useEffect(() => {
    getSkipOnboarding().then((b) => setshowOnBoarding(!b))
  }, [])

  const [isVisibleModal, setIsVisibleModal] = useState(false)

  useEffect(() => {
    if (securityCheckFailed !== undefined) {
      SplashScreen.hide()
      if (securityCheckFailed) {
        const message = getSecurityErrorMessage()

        UTIL.showSystemAlert(message, 'OK', () => RNExitApp.exitApp())
      }
    }
  }, [securityCheckFailed])

  /* auth */
  const auth = useAuthState(undefined)

  /* render */
  const ready = !!(currentLang && currentChain)

  const onRead = useCallback(
    ({ data }: { data: string }): void => {

      // @ts-ignore
      webviewInstance.current?.postMessage(
        JSON.stringify({
          reqId: isVisibleModal,
          type: RN_APIS.QR_SCAN,
          data: data,
        })
      )
    },
    [isVisibleModal]
  )

  const onlyIfScan = ({ data }: { data: string }): string => {
    const linkUrl = parseDynamicLinkURL(data)
    const appSheme =
      data.includes('terrastation:') &&
      !!UTIL.getParam({ url: data, key: 'payload' })
    const readable =
      // if kind of address
      AccAddress.validate(data) ||
      // if dynamic link
      !!linkUrl ||
      // if app scheme
      appSheme
    return readable ? '' : 'Not a valid QR code.'
  }

  const defaultViewStyle = {
    flex: 1
  }

  return (
    <>
      {ready && (
        <AppProvider value={{ alertViewProps }}>
          <ConfigProvider value={config}>
            <AuthProvider value={auth}>
              <SafeAreaProvider>
                <SafeAreaView
                  style={{
                    flex: 0,
                    backgroundColor: showOnBoarding
                      ? '#fff' : !webviewComponentLoaded
                        ? '#1f42b4' : themes?.[currentTheme]?.backgroundColor,
                  }}
                />
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={defaultViewStyle}
                >
                  <SafeAreaView
                    style={{
                      ...defaultViewStyle,
                      backgroundColor: showOnBoarding
                        ? '#fff' : !webviewComponentLoaded
                          ? '#1f42b4' : themes?.[currentTheme]?.backgroundColor,
                    }}
                  >
                    <StatusBar
                      barStyle={themes?.[currentTheme]?.textContent ?? 'light-content'}
                      backgroundColor={themes?.[currentTheme]?.backgroundColor}
                    />

                    {(securityCheckFailed) &&
                    Platform.OS === 'ios' ? (
                      <View
                        style={{
                          flex: 1,
                        }}
                      />
                    ) : showOnBoarding ? (
                      <OnBoarding
                        closeOnBoarding={(): void =>
                          setshowOnBoarding(false)
                        }
                      />
                    ) : (
                      <>
                        <View style={defaultViewStyle}>
                          <WebViewContainer
                            user={user}
                            setIsVisibleModal={setIsVisibleModal}
                          />
                        </View>
                        <AppNavigator />
                        <GlobalTopNotification />
                        <UnderMaintenance />
                        {webviewComponentLoaded && config.chain.current.name !== 'mainnet' && (
                          <DebugBanner
                            title={config.chain.current.name.toUpperCase()}
                          />
                        )}
                        <Modal
                          onRequestClose={(): void => {
                            setIsVisibleModal(false)
                          }}
                          transparent
                          visible={!!isVisibleModal}
                        >
                          <QRScan
                            onRead={onRead}
                            onlyIfScan={onlyIfScan}
                            closeModal={(): void => {
                              setIsVisibleModal(false)
                            }}
                          />
                        </Modal>
                      </>
                    )}
                  </SafeAreaView>
                </KeyboardAvoidingView>
              </SafeAreaProvider>
            </AuthProvider>
          </ConfigProvider>
        </AppProvider>
      )}
    </>
  )
}

const clearKeystoreWhenFirstRun = async (): Promise<void> => {
  if (Platform.OS === 'android') return

  const firstRun = await preferences.getBool(PreferencesEnum.firstRun)
  if (firstRun) return

  try {
    keystore.remove(KeystoreEnum.AuthData)
  } finally {
    preferences.setBool(PreferencesEnum.firstRun, true)
  }
}

export default (): ReactElement => {
  const [local, setLocal] = useState<Settings>()
  const [user, setUser] = useState<User[]>()
  const [initComplete, setInitComplete] = useState(false)

  useEffect(() => {
    clearKeystoreWhenFirstRun()

    const migratePreferences = async (): Promise<void> => {
      try {
        await keystore.migratePreferences('AD')
      } catch {}
    }

    const init = async (): Promise<void> => {
      await migratePreferences()
      const local = await settings.get()
      setLocal(local)
      const wallets = await getWallets()
      setUser(wallets)
    }

    init().then((): void => {
      setInitComplete(true)
    })
  }, [])

  return (
    <>
      {local && initComplete ? (
        <QueryClientProvider client={queryClient}>
          <RecoilRoot>
            <App settings={local} user={user} />
          </RecoilRoot>
        </QueryClientProvider>
      ) : null}
    </>
  )
}
