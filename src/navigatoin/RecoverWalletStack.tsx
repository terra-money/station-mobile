import React, { ReactElement } from 'react'

import { RecoverWalletStack } from '../types'

import Step1 from '../screens/auth/RecoverWallet/Step1'
import Step2QR from '../screens/auth/RecoverWallet/Step2QR'
import Step2Seed from '../screens/auth/RecoverWallet/Step2Seed'
import Step3Seed from '../screens/auth/RecoverWallet/Step3Seed'
import Step4Seed from '../screens/auth/RecoverWallet/Step4Seed'

import WalletRecovered from '../screens/auth/RecoverWallet/WalletRecovered'

const StakingStack = (): ReactElement => (
  <RecoverWalletStack.Navigator initialRouteName="Step1">
    <RecoverWalletStack.Screen
      name="Step1"
      component={Step1}
      options={Step1.navigationOptions}
    />
    <RecoverWalletStack.Screen
      name="Step2QR"
      component={Step2QR}
      options={Step2QR.navigationOptions}
    />
    <RecoverWalletStack.Screen
      name="Step2Seed"
      component={Step2Seed}
      options={Step2Seed.navigationOptions}
    />
    <RecoverWalletStack.Screen
      name="Step3Seed"
      component={Step3Seed}
      options={Step3Seed.navigationOptions}
    />
    <RecoverWalletStack.Screen
      name="Step4Seed"
      component={Step4Seed}
      options={Step4Seed.navigationOptions}
    />
    <RecoverWalletStack.Screen
      name="WalletRecovered"
      component={WalletRecovered}
      options={{ headerShown: false }}
    />
  </RecoverWalletStack.Navigator>
)

export default StakingStack
