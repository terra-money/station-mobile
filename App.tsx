import React, { ReactNode, useState, useEffect } from 'react'
import { Modal, View, TouchableOpacity } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  NavigationContainer,
  DefaultTheme,
  LinkingOptions,
} from '@react-navigation/native'

import { useConfigState, ConfigProvider } from '@terra-money/use-native-station'
import { useAuthState, AuthProvider } from '@terra-money/use-native-station'

import { RootStack, Settings } from './src/types'
import { settings } from './src/utils/storage'
import { AppProvider } from './src/hooks'

import Tabs from './src/screens/Tabs'
import AuthMenu from './src/screens/auth/AuthMenu'
import Select from './src/screens/auth/Select'
import New from './src/screens/auth/New'
import Add from './src/screens/auth/Add'

import EStyleSheet from 'react-native-extended-stylesheet'
import { StatusBar } from 'react-native'
import { Platform } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { hasNotch } from 'react-native-device-info'
import OnBoarding from './src/screens/OnBoarding'
import Setting from './src/screens/Setting'
import { getSkipOnboarding } from './src/utils/InternalStorage'
import ConnectView from './src/screens/topup/ConnectView'
import SendTxView from './src/screens/topup/SendTxView'

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

const TerraTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F9FAFF',
  },
}

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

const App = ({ settings: { lang, user } }: { settings: Settings }) => {
  // if(__DEV__) {
  //   console.log("Hello __DEV__")
  // }

  /* drawer */
  const drawer = useDrawerState()

  /* provider */
  const config = useConfigState({ lang, chain })
  const { current: currentLang = '' } = config.lang
  const { current: currentChainOptions } = config.chain
  const { key: currentChain = '' } = currentChainOptions

  /* onboarding */
  const [skipOnboarding, setSkipOnboarding] = useState<boolean | null>(null)

  /* auth */
  const auth = useAuthState(user)

  /* render */
  const ready = !!(currentLang && currentChain)

  useEffect(() => {
    getSkipOnboarding(setSkipOnboarding)
    SplashScreen.hide()
  }, [])

  /* linking */
  const linking: LinkingOptions = {
    prefixes: ['terrastation://'],
    config: {
      screens: {
        ConnectView: {
          path: 'connect/:arg',
        },
        SendTxView: {
          path: 'sign/:arg',
        },
      },
    },
  }

  return !ready || skipOnboarding === null ? null : (
    <AppProvider value={{ drawer }}>
      <ConfigProvider value={config}>
        <AuthProvider value={auth}>
          <SafeAreaProvider>
            <NavigationContainer theme={TerraTheme} linking={linking}>
              <StatusBar
                barStyle='dark-content'
                backgroundColor='transparent'
                translucent={false}
              />
              <RootStack.Navigator
                initialRouteName={skipOnboarding ? 'Tabs' : 'OnBoarding'}
              >
                <RootStack.Screen
                  name='OnBoarding'
                  component={OnBoarding}
                  options={{ headerShown: false, animationEnabled: false }}
                />
                <RootStack.Screen
                  name='Tabs'
                  component={Tabs}
                  options={{ headerShown: false, animationEnabled: false }}
                />
                <RootStack.Screen
                  name='Setting'
                  component={Setting}
                  options={{ headerShown: false }}
                />
                <RootStack.Screen
                  name='AuthMenu'
                  component={AuthMenu}
                  options={{ animationEnabled: false }}
                />
                <RootStack.Screen
                  name='Select'
                  component={Select}
                  options={{ animationEnabled: false }}
                />
                <RootStack.Screen
                  name='New'
                  component={New}
                  options={{ animationEnabled: false }}
                />
                <RootStack.Screen
                  name='Add'
                  component={Add}
                  options={{ animationEnabled: false }}
                />
                <RootStack.Screen
                  name='ConnectView'
                  component={ConnectView}
                  options={{ animationEnabled: false }}
                />
                <RootStack.Screen
                  name='SendTxView'
                  component={SendTxView}
                  options={{ animationEnabled: false }}
                />
              </RootStack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>

          <Modal visible={drawer.isOpen} animationType='fade' transparent>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.5)' }}>
              <TouchableOpacity onPress={drawer.close} style={styles.top} />
              <View style={styles.bottom}>{drawer.content}</View>
            </View>
          </Modal>
        </AuthProvider>
      </ConfigProvider>
    </AppProvider>
  )
}

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
