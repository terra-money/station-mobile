import React, { ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import RecoverWalletStep1 from '../screens/auth/RecoverWallet/Step1'
import RecoverWalletStep2 from '../screens/auth/RecoverWallet/Step2'
import RecoverWalletStep3 from '../screens/auth/RecoverWallet/Step3'

import WalletRecovered from '../screens/auth/RecoverWallet/WalletRecovered'
const Stack = createStackNavigator()

const StakingStack = (): ReactElement => (
  <Stack.Navigator initialRouteName="RecoverWalletStep1">
    <Stack.Screen
      name="RecoverWalletStep1"
      component={RecoverWalletStep1}
      options={RecoverWalletStep1.navigationOptions}
    />
    <Stack.Screen
      name="RecoverWalletStep2"
      component={RecoverWalletStep2}
      options={RecoverWalletStep2.navigationOptions}
    />
    <Stack.Screen
      name="RecoverWalletStep3"
      component={RecoverWalletStep3}
      options={RecoverWalletStep3.navigationOptions}
    />
    <Stack.Screen
      name="WalletRecovered"
      component={WalletRecovered}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
)

export default StakingStack
