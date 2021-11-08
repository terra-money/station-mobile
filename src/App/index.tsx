import React, { useState, useEffect, ReactElement } from 'react'
import { LogBox, Platform, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import { RecoilRoot } from 'recoil'
import RNExitApp from 'react-native-exit-app'
import { QueryClient, QueryClientProvider } from 'react-query'

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

import StatusBar from 'components/StatusBar'
import preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'
import keystore, { KeystoreEnum } from 'nativeModules/keystore'
import color from 'styles/color'

import useSecurity from 'hooks/useSecurity'
import useNetworks from 'hooks/useNetworks'
import { getWallet } from 'utils/wallet'
import { getSkipOnboarding, settings } from 'utils/storage'

import NoInternet from './NoInternet'
import DebugBanner from './DebugBanner'
import OnBoarding from './OnBoarding'
import AppModal from './AppModal'
import AlertView, { useAlertViewState } from './AlertView'
import LoadingView from './LoadingView'
import GlobalTopNotification from './GlobalTopNotification'
import UnderMaintenance from './UnderMaintenance'

LogBox.ignoreLogs(['EventEmitter.removeListener'])

const queryClient = new QueryClient()

const App = ({
  settings: { lang, chain, currency },
  user,
}: {
  settings: Settings
  user?: User
}): ReactElement => {
  /* drawer */
  const alertViewProps = useAlertViewState()
  const { networks } = useNetworks()

  const chainOption =
    (chain ? networks[chain.name] : networks.mainnet) ||
    networks.mainnet

  /* provider */
  const config = useConfigState({
    lang,
    chain: chainOption,
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

        UTIL.showSystemAlert(message, 'OK', () => RNExitApp.exitApp())
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
                    <UnderMaintenance />
                    {config.chain.current.name !== 'mainnet' && (
                      <DebugBanner
                        title={config.chain.current.name.toUpperCase()}
                      />
                    )}
                  </>
                )}
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

    const migratePreferences = async (): Promise<void> => {
      try {
        await keystore.migratePreferences('AD')
      } catch {}
    }

    const init = async (): Promise<void> => {
      await migratePreferences()
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
        <QueryClientProvider client={queryClient}>
          <RecoilRoot>
            <App settings={local} user={user} />
          </RecoilRoot>
        </QueryClientProvider>
      ) : null}
    </>
  )
}
