import React, { useState, useEffect, ReactElement } from 'react'
import { StatusBar } from 'react-native'
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
import AlertModal, {
  useAlertModalState,
} from 'components/onlyForApp.tsx/AlertModal'
import Drawer, {
  useDrawerState,
} from 'components/onlyForApp.tsx/Drawer'

import networks from './networks'

let App = ({
  settings: { lang, user },
}: {
  settings: Settings
}): ReactElement => {
  /* drawer */
  const drawer = useDrawerState()
  const modal = useModalState()
  const alertModal = useAlertModalState()

  /* provider */
  const config = useConfigState({ lang, chain: networks.mainnet })
  const { current: currentLang = '' } = config.lang
  const { current: currentChainOptions } = config.chain
  const { name: currentChain = '' } = currentChainOptions

  /* onboarding */

  const [showOnBoarding, setshowOnBoarding] = useState<boolean>(false)

  /* auth */
  const auth = useAuthState(user)

  /* render */
  const ready = !!(currentLang && currentChain)

  useEffect(() => {
    const checkShowOnboarding = async (): Promise<void> => {
      setshowOnBoarding(false === (await getSkipOnboarding()))
      SplashScreen.hide()
    }
    checkShowOnboarding()
  }, [])

  return (
    <>
      {showOnBoarding ? (
        <OnBoarding setshowOnBoarding={setshowOnBoarding} />
      ) : (
        ready && (
          <AppProvider value={{ drawer, modal, alertModal }}>
            <ConfigProvider value={config}>
              <AuthProvider value={auth}>
                <SafeAreaProvider>
                  <StatusBar
                    barStyle="dark-content"
                    backgroundColor="transparent"
                    translucent={false}
                  />
                  <RecoilRoot>
                    <AppNavigator />
                    <AppModal modal={modal} />
                    <Drawer drawer={drawer} />
                    <AlertModal modal={alertModal} />
                  </RecoilRoot>
                </SafeAreaProvider>
              </AuthProvider>
            </ConfigProvider>
          </AppProvider>
        )
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
