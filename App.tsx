import React, { useState, ReactNode } from 'react'
import { StyleSheet, Modal, View, TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useConfigState, ConfigProvider } from '@terra-money/use-native-station'
import { useAuthState, AuthProvider } from '@terra-money/use-native-station'
import { AppStack } from './src/types/navigation'
import { AppProvider } from './src/hooks'
import Menu from './src/screens/Menu'
import Auth from './src/screens/auth/Auth'

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
              <AppStack.Navigator>
                <AppStack.Screen name="Menu" component={Menu} />
                <AppStack.Screen name="Auth" component={Auth} />
              </AppStack.Navigator>
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
