import React, { ReactElement } from 'react'
import { AuthStack } from '../types'

import AuthMenu from '../screens/auth/AuthMenu'
import SelectWallet from '../screens/auth/SelectWallet'
import NewWalletStack from './NewWalletStack'
import RecoverWalletStack from './RecoverWalletStack'

const AppNavigator = (): ReactElement => {
  return (
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
  )
}

export default AppNavigator
