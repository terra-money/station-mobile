import React, { ReactNode, useState, useEffect } from 'react'
import {
  Modal,
  View,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import EStyleSheet from 'react-native-extended-stylesheet'
import SplashScreen from 'react-native-splash-screen'
import { hasNotch } from 'react-native-device-info'

import {
  useAuthState,
  AuthProvider,
  useConfigState,
  ConfigProvider,
} from '@terra-money/use-native-station'

import { Settings } from './src/types'
import { getSkipOnboarding, settings } from './src/utils/storage'
import { AppProvider } from './src/hooks'

import AppNavigator from './src/navigatoin'
import CodePush from 'react-native-code-push'

EStyleSheet.build({
  $primaryColor: 'rgb(32,67,181)', //"#2043B5",
  $primaryColorOp20: 'rgba(32,67,181,.2)', //"#2043B5",
  $primaryColorOp10: 'rgba(32,67,181,.1)', //"#2043B5",

  $dividerColor: '#EDF1F7',

  /**
   * iOS는 PostScriptName, Android는 FileName으로 Font를 구별
   */
  '@media ios': {
    $fontGothamBold: 'Gotham Bold',
    $fontGothamBook: 'Gotham Book',
    $fontGothamMedium: 'Gotham Medium',
    $fontGothamLight: 'Gotham Light',
  },
  '@media android': {
    $fontGothamBold: 'Gotham-Bold',
    $fontGothamBook: 'Gotham-Book',
    $fontGothamMedium: 'Gotham-Medium',
    $fontGothamLight: 'Gotham-Light',
  },
})

/* config */
// const chain = {
//   key: 'columbus',
//   name: 'columbus-3',
//   hostname: 'fcd.terra.dev',
//   port: 443,
//   secure: true,
// }

const chain = {
  key: 'tequila',
  name: 'tequila-0004',
  hostname: 'tequila-fcd.terra.dev',
  port: 443,
  secure: true,
}

let App = ({ settings: { lang, user } }: { settings: Settings }) => {
  /* drawer */
  const drawer = useDrawerState()

  /* provider */
  const config = useConfigState({ lang, chain })
  const { current: currentLang = '' } = config.lang
  const { current: currentChainOptions } = config.chain
  const { key: currentChain = '' } = currentChainOptions

  /* onboarding */
  const [skipOnboarding, setSkipOnboarding] = useState<
    boolean | null
  >(null)

  /* auth */
  const auth = useAuthState(user)

  /* render */
  const ready = !!(currentLang && currentChain)

  useEffect(() => {
    const checkShowOnboarding = async () => {
      setSkipOnboarding(await getSkipOnboarding())
      SplashScreen.hide()
    }
    checkShowOnboarding()
  }, [])

  return !ready || skipOnboarding === null ? null : (
    <AppProvider value={{ drawer }}>
      <ConfigProvider value={config}>
        <AuthProvider value={auth}>
          <SafeAreaProvider>
            <StatusBar
              barStyle="dark-content"
              backgroundColor="transparent"
              translucent={false}
            />
            <AppNavigator skipOnboarding={skipOnboarding} />
          </SafeAreaProvider>

          <Modal
            visible={drawer.isOpen}
            animationType="fade"
            transparent
          >
            <View
              style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.5)' }}
            >
              <TouchableOpacity
                onPress={drawer.close}
                style={styles.top}
              />
              <View style={styles.bottom}>{drawer.content}</View>
            </View>
          </Modal>
        </AuthProvider>
      </ConfigProvider>
    </AppProvider>
  )
}

const CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  updateDialog: false,
  installMode: CodePush.InstallMode.IMMEDIATE,
}

App = CodePush(CodePushOptions)(App)

export default () => {
  const [local, setLocal] = useState<Settings>()

  useEffect(() => {
    const init = async () => {
      const local = await settings.get()
      setLocal(local)
    }

    init()
  }, [])

  return local ? <App settings={local} /> : null
}

/* hooks */
const useDrawerState = (): Drawer => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<ReactNode>(null)

  const open = (content: ReactNode) => {
    setContent(content)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    setContent(null)
  }

  return { isOpen, open, close, content }
}

/* styles */
const styles = EStyleSheet.create({
  top: {
    flex: 1,
  },

  bottom: {
    // height: 215,
    marginHorizontal: 20,
    marginBottom: Platform.OS === 'ios' && hasNotch() ? 54 : 32,
    // backgroundColor: 'rgba(0,0,0,.5)',
  },
})
