import React, {
  ReactNode,
  useState,
  useEffect,
  ReactElement,
} from 'react'
import {
  Modal,
  View,
  TouchableOpacity,
  StatusBar,
  Platform,
  SafeAreaView,
  StyleSheet,
} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import { hasNotch } from 'react-native-device-info'
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

/* config */
// const chain = {
//   key: 'columbus',
//   name: 'columbus-3',
//   hostname: 'fcd.terra.dev',
//   port: 443,
//   secure: true,
// }

const chain = {
  name: 'testnet',
  chainID: 'tequila-0004',
  lcd: 'https://tequila-lcd.terra.dev',
  fcd: 'https://tequila-fcd.terra.dev',
  ws: 'wss://tequila-fcd.terra.dev',
}

let App = ({
  settings: { lang, user },
}: {
  settings: Settings
}): ReactElement => {
  /* drawer */
  const drawer = useDrawerState()
  const modal = useModalState()

  /* provider */
  const config = useConfigState({ lang, chain })
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
          <AppProvider value={{ drawer, modal }}>
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
                    <Modal
                      visible={modal.isOpen}
                      onRequestClose={modal.onRequestClose}
                      transparent
                    >
                      <SafeAreaView style={{ flex: 1 }}>
                        {modal.content}
                      </SafeAreaView>
                    </Modal>
                  </RecoilRoot>
                </SafeAreaProvider>

                <Modal
                  visible={drawer.isOpen}
                  animationType="fade"
                  transparent
                >
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(0,0,0,.5)',
                    }}
                  >
                    <TouchableOpacity
                      onPress={drawer.close}
                      style={styles.top}
                    />
                    <View style={styles.bottom}>
                      {drawer.content}
                    </View>
                  </View>
                </Modal>
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

/* hooks */
const useDrawerState = (): Drawer => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<ReactNode>(null)

  const open = (content: ReactNode): void => {
    setContent(content)
    setIsOpen(true)
  }

  const close = (): void => {
    setIsOpen(false)
    setContent(null)
  }

  return { isOpen, open, close, content }
}

const useModalState = (): AppModal => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<ReactNode>(null)
  const [config, setConfig] = useState<AppModalConfig>()

  const open = (
    content: ReactNode,
    config?: AppModalConfig
  ): void => {
    setContent(content)
    setIsOpen(true)
    setConfig(config)
  }

  const close = (): void => {
    setIsOpen(false)
    setContent(null)
  }

  const onRequestClose = (): void => {
    config?.onRequestClose ? config.onRequestClose() : close()
  }

  return { isOpen, open, close, content, onRequestClose }
}

/* styles */
const styles = StyleSheet.create({
  top: {
    flex: 1,
  },

  bottom: {
    marginHorizontal: 20,
    marginBottom: Platform.OS === 'ios' && hasNotch() ? 54 : 32,
  },
})
