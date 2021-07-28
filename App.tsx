import React, { useState, useEffect, ReactElement } from 'react'
import { Platform, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import { RecoilRoot } from 'recoil'
import RNExitApp from 'react-native-exit-app'

import {
  useAuthState,
  AuthProvider,
  useConfigState,
  ConfigProvider,
  User,
} from 'use-station/src'

import { Settings } from './src/types'
import { getSkipOnboarding, settings } from './src/utils/storage'
import { AppProvider } from './src/hooks'

import AppNavigator from './src/navigatoin'
import OnBoarding from './src/screens/OnBoarding'
import AppModal from 'components/onlyForApp.tsx/AppModal'
import AlertView, {
  useAlertViewState,
} from 'components/onlyForApp.tsx/AlertView'
import { LoadingView } from 'components/onlyForApp.tsx/LoadingView'
import GlobalTopNotification from 'components/onlyForApp.tsx/GlobalTopNotification'
import networks from './networks'
import StatusBar from 'components/StatusBar'
import { getWallet } from 'utils/wallet'
import preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'
import keystore, { KeystoreEnum } from 'nativeModules/keystore'
import NoInternet from './src/screens/NoInternet'
import DebugBanner from './src/screens/DebugBanner'
import color from 'styles/color'

import { showSystemAlert } from 'utils/util'
import useSecurity from 'hooks/useSecurity'

const App = ({
  settings: { lang, chain, currency },
  user,
}: {
  settings: Settings
  user?: User
}): ReactElement => {
  /* drawer */
  const alertViewProps = useAlertViewState()

  /* provider */
  const config = useConfigState({
    lang,
    chain: chain || networks.mainnet,
    currency,
  })
  const { current: currentLang = '' } = config.lang
  const { current: currentChainOptions } = config.chain
  const { name: currentChain = '' } = currentChainOptions

  const {
    getSecurityErrorMessage,
    securityCheckFailed,
  } = useSecurity()

  /* onboarding */
  const [showOnBoarding, setshowOnBoarding] = useState<boolean>(false)

  useEffect(() => {
    getSkipOnboarding().then((b) => setshowOnBoarding(!b))
  }, [])

  useEffect(() => {
    if (securityCheckFailed !== undefined) {
      SplashScreen.hide()
      if (securityCheckFailed) {
        const message = getSecurityErrorMessage()

        showSystemAlert(message, 'OK', () => RNExitApp.exitApp())
      }
    }
  }, [securityCheckFailed])

  /* auth */
  const auth = useAuthState(user)

  /* render */
  const ready = !!(currentLang && currentChain)

  return (
    <>
      {ready && (
        <AppProvider value={{ alertViewProps }}>
          <ConfigProvider value={config}>
            <AuthProvider value={auth}>
              <SafeAreaProvider>
                <StatusBar theme="white" />
                <RecoilRoot>
                  {securityCheckFailed && Platform.OS === 'ios' ? (
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: color.sapphire,
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
                      <AppNavigator />
                      <AppModal />
                      <AlertView alertViewProps={alertViewProps} />
                      <GlobalTopNotification />
                      <NoInternet />
                      <LoadingView />
                      {config.chain.current.name !== 'mainnet' && (
                        <DebugBanner
                          title={config.chain.current.name.toUpperCase()}
                        />
                      )}
                    </>
                  )}
                </RecoilRoot>
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
  const [user, setUser] = useState<User>()
  const [initComplete, setInitComplete] = useState(false)

  useEffect(() => {
    clearKeystoreWhenFirstRun()

    try {
      keystore.migratePreferences('AD')
    } catch {}

    const init = async (): Promise<void> => {
      const local = await settings.get()
      setLocal(local)
      if (local.walletName) {
        const wallet = await getWallet(local.walletName)
        setUser(wallet)
      }
    }

    init().then((): void => {
      setInitComplete(true)
    })
  }, [])

  return (
    <>
      {local && initComplete ? (
        <App settings={local} user={user} />
      ) : null}
    </>
  )
}
