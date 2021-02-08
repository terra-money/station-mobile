import React, { ReactElement } from 'react'
import {
  NavigationContainer,
  DefaultTheme,
} from '@react-navigation/native'

import { AuthStack } from '../types'

import AuthMenu from '../screens/auth/AuthMenu'
import SelectWallet from '../screens/auth/SelectWallet'
import NewWalletStack from './NewWalletStack'
import RecoverWalletStack from './RecoverWalletStack'

const TerraTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F9FAFF',
  },
}

const AppNavigator = (): ReactElement => {
  return (
    <NavigationContainer theme={TerraTheme}>
      <AuthStack.Navigator>
        <AuthStack.Screen
          name="AuthMenu"
          component={AuthMenu}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="SelectWallet"
          component={SelectWallet}
          options={SelectWallet.navigationOptions}
        />
        <AuthStack.Screen
          name="NewWallet"
          component={NewWalletStack}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="RecoverWallet"
          component={RecoverWalletStack}
          options={{ headerShown: false }}
        />
      </AuthStack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
