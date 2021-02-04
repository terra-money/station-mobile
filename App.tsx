import React, { useState, useEffect, ReactElement } from 'react'
import {
  AppState,
  AppStateStatus,
  Platform,
  StatusBar,
} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import { RecoilRoot } from 'recoil'

import {
  useAuthState,
  AuthProvider,
  useConfigState,
  ConfigProvider,
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
import Drawer, {
  useDrawerState,
} from 'components/onlyForApp.tsx/Drawer'
import { LoadingView } from 'components/onlyForApp.tsx/LoadingView'
import Update from './src/screens/Update'
import networks, { isDev, version } from './networks'
import { getJson } from 'utils/request'
import { useUpdate } from 'hooks/useUpdate'

let App = ({
  settings: { lang, user, chain, currency },
}: {
  settings: Settings
}): ReactElement => {
  /* drawer */
  const drawer = useDrawerState()
  const modal = useModalState()
  const alertViewProps = useAlertViewState()

  /* provider */
  const config = useConfigState({
    lang,
    chain: chain || networks.tequila,
    currency,
  })
  const { current: currentLang = '' } = config.lang
  const { current: currentChainOptions } = config.chain
  const { name: currentChain = '' } = currentChainOptions

  /* onboarding */
  const [showOnBoarding, setshowOnBoarding] = useState<boolean>(false)

  const closeOnBoarding = (): void => {
    setshowOnBoarding(false)
  }

  /* update */
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

    check()
  }, [])

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
        <AppProvider value={{ drawer, modal, alertViewProps }}>
          <ConfigProvider value={config}>
            <AuthProvider value={auth}>
              <SafeAreaProvider>
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
                      <StatusBar
                        barStyle="dark-content"
                        backgroundColor="transparent"
                        translucent={false}
                      />
                      <AppNavigator />
                      <AppModal modal={modal} />
                      <Drawer drawer={drawer} />
                      <AlertView alertViewProps={alertViewProps} />
                    </>
                  )}
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

const CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  updateDialog: false,
  installMode: CodePush.InstallMode.IMMEDIATE,
}

App = CodePush(CodePushOptions)(App)

export default (): ReactElement => {
  const [local, setLocal] = useState<Settings>()

  useEffect(() => {
    const init = async (): Promise<void> => {
      const local = await settings.get()
      setLocal(local)
    }

    init()
  }, [])

  return <>{local ? <App settings={local} /> : null}</>
}
