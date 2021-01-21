import React, { ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import NewWalletStep1 from '../screens/auth/NewWallet/Step1'
import NewWalletStep2 from '../screens/auth/NewWallet/Step2'
import NewWalletStep3 from '../screens/auth/NewWallet/Step3'

import WalletCreated from '../screens/auth/NewWallet/WalletCreated'
const Stack = createStackNavigator()

const StakingStack = (): ReactElement => (
  <Stack.Navigator initialRouteName="NewWalletStep1">
    <Stack.Screen
      name="NewWalletStep1"
      component={NewWalletStep1}
      options={NewWalletStep1.navigationOptions}
    />
    <Stack.Screen
      name="NewWalletStep2"
      component={NewWalletStep2}
      options={NewWalletStep2.navigationOptions}
    />
    <Stack.Screen
      name="NewWalletStep3"
      component={NewWalletStep3}
      options={NewWalletStep3.navigationOptions}
    />
    <Stack.Screen
      name="WalletCreated"
      component={WalletCreated}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
)

export default StakingStack
