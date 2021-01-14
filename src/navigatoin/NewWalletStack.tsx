import React, { ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import NewWalletStep1 from '../screens/auth/NewWallet/Step1'
import NewWalletStep2 from '../screens/auth/NewWallet/Step2'
import NewWalletStep3 from '../screens/auth/NewWallet/Step3'

const Stack = createStackNavigator()

const StakingStack = (): ReactElement => (
  <Stack.Navigator initialRouteName="NewWalletStep1">
    <Stack.Screen
      name="NewWalletStep1"
      component={NewWalletStep1}
      options={{ headerTitle: NewWalletStep1.header }}
    />
    <Stack.Screen
      name="NewWalletStep2"
      component={NewWalletStep2}
      options={{ headerTitle: NewWalletStep2.header }}
    />
    <Stack.Screen
      name="NewWalletStep3"
      component={NewWalletStep3}
      options={{ headerTitle: NewWalletStep3.header }}
    />
  </Stack.Navigator>
)

export default StakingStack
