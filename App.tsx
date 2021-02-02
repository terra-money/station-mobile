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
import AlertModal, {
  useAlertModalState,
} from 'components/onlyForApp.tsx/AlertModal'
import Drawer, {
  useDrawerState,
} from 'components/onlyForApp.tsx/Drawer'
import Update from './src/screens/Update'

import networks from './networks'

let App = ({
  settings: { lang, user, chain, currency },
}: {
  settings: Settings
}): ReactElement => {
  /* drawer */
  const drawer = useDrawerState()
  const modal = useModalState()
  const alertModal = useAlertModalState()

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
  /* update */
  const [updateAvailable, setUpdateAvailable] = useState<boolean>()
  const [receivedBytes, setReceivedBytes] = useState<number>(0)
  const [totalBytes, setTotalBytes] = useState<number>(0)

  useEffect(() => {
    CodePush.sync(
      {
        updateDialog: undefined,
        installMode: CodePush.InstallMode.IMMEDIATE,
      },
      (status) => {
        switch (status) {
          case CodePush.SyncStatus.UP_TO_DATE:
            setUpdateAvailable(false)
            break
          case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
            break
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            setUpdateAvailable(true)
            break
          case CodePush.SyncStatus.INSTALLING_UPDATE:
            setUpdateAvailable(true)
            break
          case CodePush.SyncStatus.UPDATE_INSTALLED:
            setUpdateAvailable(true)
            break
        }
      },
      ({ receivedBytes, totalBytes }) => {
        setReceivedBytes(receivedBytes)
        setTotalBytes(totalBytes)
      }
    )
  }, [])

  const closeOnBoarding = (): void => {
    setshowOnBoarding(false)
  }

  const checkUpdate = async (): Promise<void> => {
    const update = await CodePush.checkForUpdate()
    if (update) {
      setUpdateAvailable(true)
    } else {
      setUpdateAvailable(false)
    }
  }

  useEffect(() => {
    Platform.OS === 'android' && checkUpdate()

    const activeListener = (state: AppStateStatus): void => {
      state === 'active' && checkUpdate()
    }

    AppState.addEventListener('change', activeListener)
    return (): void => {
      AppState.removeEventListener('change', activeListener)
    }
  }, [])

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

  useEffect(() => {
    updateAvailable !== undefined && SplashScreen.hide()
  }, [updateAvailable])

  return (
    <>
      {ready && updateAvailable !== undefined && (
        <AppProvider value={{ drawer, modal, alertModal }}>
          <ConfigProvider value={config}>
            <AuthProvider value={auth}>
              <SafeAreaProvider>
                <RecoilRoot>
                  {updateAvailable ? (
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
                      <AlertModal modal={alertModal} />
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
