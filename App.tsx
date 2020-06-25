import React, { useState, ReactNode } from 'react'
import { StyleSheet, Modal, View, TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useConfigState, ConfigProvider } from '@terra-money/use-native-station'
import { useAuthState, AuthProvider } from '@terra-money/use-native-station'
import { RootStack } from './src/types/navigation'
import { AppProvider } from './src/hooks'
import Tabs from './src/screens/Tabs'
import AuthMenu from './src/screens/auth/AuthMenu'
import Select from './src/screens/auth/Select'
import New from './src/screens/auth/New'
import Add from './src/screens/auth/Add'

/* config */
const chain = {
  key: 'columbus',
  name: 'columbus-3',
  hostname: 'fcd.terra.dev',
  port: 443,
  secure: true,
}

const App = () => {
  /* initial settings */
  const lang = 'en'
  const user = undefined

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
            <NavigationContainer>
              <RootStack.Navigator>
                <RootStack.Screen name="Tabs" component={Tabs} />
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

export default App

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
const styles = StyleSheet.create({
  top: {
    flex: 1,
  },

  bottom: {
    height: 215,
    backgroundColor: 'white',
  },
})
