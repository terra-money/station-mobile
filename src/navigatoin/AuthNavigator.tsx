import React, { ReactElement } from 'react'
import {
  NavigationContainer,
  DefaultTheme,
} from '@react-navigation/native'
import { useRecoilValue } from 'recoil'

import { AuthStack } from '../types'

import AuthMenu from '../screens/auth/AuthMenu'
import SelectWallet from '../screens/auth/SelectWallet'
import NewWalletStack from './NewWalletStack'
import RecoverWalletStack from './RecoverWalletStack'
import LinkingStore from 'stores/LinkingStore'

const TerraTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F9FAFF',
  },
}

const AppNavigator = (): ReactElement => {
  /* linking */
  const authLinking = useRecoilValue(LinkingStore.authLinking)

  return (
    <NavigationContainer theme={TerraTheme} linking={authLinking}>
      <AuthStack.Navigator>
        <AuthStack.Screen
          name="AuthMenu"
          component={AuthMenu}
          options={AuthMenu.navigationOptions}
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
