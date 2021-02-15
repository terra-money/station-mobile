import React, { useState, useEffect, ReactElement } from 'react'
import { Alert, NativeModules, Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import { RecoilRoot } from 'recoil'
import _ from 'lodash'

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
import CodePush from 'react-native-code-push'
import OnBoarding from './src/screens/OnBoarding'
import AppModal, {
  useModalState,
} from 'components/onlyForApp.tsx/AppModal'
import AlertView, {
  useAlertViewState,
} from 'components/onlyForApp.tsx/AlertView'

import { LoadingView } from 'components/onlyForApp.tsx/LoadingView'
import Update from './src/screens/Update'
import networks, { isDev, version } from './networks'
import { getJson } from 'utils/request'
import { useUpdate } from 'hooks/useUpdate'
import StatusBar from 'components/StatusBar'
import RNExitApp from 'react-native-exit-app'
import { getWallet } from 'utils/wallet'
import preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'
import keystore from 'nativeModules/keystore'
import NoInternet from './src/screens/NoInternet'
import * as Sentry from '@sentry/react-native'

Sentry.init({
  dsn:
    'https://f25cbe79cc4a451d8be908e655dd073e@o247107.ingest.sentry.io/5636979',
})

let App = ({
  settings: { lang, chain, currency },
  user,
}: {
  settings: Settings
  user?: User
}): ReactElement => {
  /* drawer */
  const modal = useModalState()
  const alertViewProps = useAlertViewState()

  /* provider */
  const config = useConfigState({
    lang,
    chain: chain || (isDev ? networks.tequila : networks.mainnet),
    currency,
  })
  const { current: currentLang = '' } = config.lang
  const { current: currentChainOptions } = config.chain
  const { name: currentChain = '' } = currentChainOptions

  /* root check */
  const [isRooted, setRooted] = useState<boolean | undefined>(
    undefined
  )
  useEffect(() => {
    if (isRooted === undefined) {
      const showAlert = (message: string): void => {
        Alert.alert(
          '',
          message,
          [
            {
              text: 'OK',
              onPress: (): void => RNExitApp.exitApp(),
            },
          ],
          { cancelable: false }
        )
      }

      NativeModules.RootChecker.isDeviceRooted().then(
        (ret: boolean) => {
          setRooted(ret)

          ret &&
            showAlert(
              'The device is rooted. For security reasons the application cannot be run from a rooted device.'
            )
        }
      )
    }
  }, [])

  /* onboarding */
  const [showOnBoarding, setshowOnBoarding] = useState<boolean>(false)

  const closeOnBoarding = (): void => {
    setshowOnBoarding(false)
  }

  /* codepush */
  const {
    checkUpdate,
    syncUpdate,
    receivedBytes,
    totalBytes,
    isUpToDate,
  } = useUpdate()

  const [updateAvailable, setUpdateAvailable] = useState<boolean>()

  useEffect(() => {
    const check = async (): Promise<void> => {
      const serverVersion = await getJson(
        isDev ? version.staging : version.production
      )
      const update = await checkUpdate(serverVersion)
      setUpdateAvailable(update)
    }

    isRooted === false && check()
  }, [isRooted])

  useEffect(() => {
    updateAvailable !== undefined && SplashScreen.hide()
    updateAvailable === true && syncUpdate()
  }, [updateAvailable])

  /* auth */
  const auth = useAuthState(user)
  /* render */
  const ready = !!(currentLang && currentChain)

  useEffect(() => {
    const checkShowOnboarding = async (): Promise<void> => {
      setshowOnBoarding(false === (await getSkipOnboarding()))
    }
    checkShowOnboarding()
  }, [])

  return (
    <>
      {ready && updateAvailable !== undefined && (
        <AppProvider value={{ modal, alertViewProps }}>
          <ConfigProvider value={config}>
            <AuthProvider value={auth}>
              <SafeAreaProvider>
                <StatusBar theme="white" />
                <RecoilRoot>
                  {updateAvailable && !isUpToDate ? (
                    <Update
                      receivedBytes={receivedBytes}
                      totalBytes={totalBytes}
                    />
                  ) : showOnBoarding ? (
                    <OnBoarding closeOnBoarding={closeOnBoarding} />
                  ) : (
                    <>
                      <AppNavigator />
                      <AppModal modal={modal} />
                      <AlertView alertViewProps={alertViewProps} />
                    </>
                  )}
                  <NoInternet />
                  <LoadingView />
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
  if (Platform.OS !== 'ios') return

  const firstRun = await preferences.getBool(PreferencesEnum.firstRun)
  if (firstRun) return

  try {
    keystore.remove('BAD')
    keystore.remove('AD')
    const wallets = await preferences.getString(
      PreferencesEnum.wallets
    )

    if (wallets) {
      _.forEach(JSON.parse(wallets), ({ name }) => {
        keystore.remove(name)
      })
    }
    preferences.remove(PreferencesEnum.wallets)
  } catch {
  } finally {
    preferences.setBool(PreferencesEnum.firstRun, true)
  }
}

const CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  updateDialog: false,
  installMode: CodePush.InstallMode.IMMEDIATE,
}

App = CodePush(CodePushOptions)(App)

export default (): ReactElement => {
  const [local, setLocal] = useState<Settings>()
  const [user, setUser] = useState<User>()
  const [initComplete, setInitComplete] = useState(false)

  useEffect(() => {
    clearKeystoreWhenFirstRun()
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
