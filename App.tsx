import React, { ReactNode, useState, useEffect } from 'react'
import { Modal, View, TouchableOpacity } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'

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

import EStyleSheet from 'react-native-extended-stylesheet';

EStyleSheet.build({
  $primaryColor: "#2043B5",
  $dividerColor: "#EDF1F7"
});

const TerraTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F9FAFF'
  },
};

/* config */
const chain = {
  key: 'columbus',
  name: 'columbus-3',
  hostname: 'fcd.terra.dev',
  port: 443,
  secure: true,
}

const App = ({ settings: { lang, user } }: { settings: Settings }) => {
  /* drawer */
  const drawer = useDrawerState()

  /* provider */
  const config = useConfigState({ lang, chain })
  const { current: currentLang = '' } = config.lang
  const { current: currentChainOptions } = config.chain
  const { key: currentChain = '' } = currentChainOptions

  /* auth */
  const auth = useAuthState(user)

  /* render */
  const ready = !!(currentLang && currentChain)

  return !ready ? null : (
    <AppProvider value={{ drawer }}>
      <ConfigProvider value={config}>
        <AuthProvider value={auth}>
          <SafeAreaProvider>
            <NavigationContainer theme={TerraTheme}>
              <RootStack.Navigator>
                <RootStack.Screen name="Tabs" component={Tabs} options={{headerShown: false}} />
                <RootStack.Screen name="AuthMenu" component={AuthMenu} />
                <RootStack.Screen name="Select" component={Select} />
                <RootStack.Screen name="New" component={New} />
                <RootStack.Screen name="Add" component={Add} />
              </RootStack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>

          <Modal visible={drawer.isOpen} animationType="slide" transparent>
            <TouchableOpacity onPress={drawer.close} style={styles.top} />
            <View style={styles.bottom}>{drawer.content}</View>
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
    height: 215,
    backgroundColor: 'white',
  },
})