import React, { ReactElement } from 'react'
import {
  NavigationContainer,
  DefaultTheme,
  LinkingOptions,
} from '@react-navigation/native'

import { RootStack } from '../types'

import Tabs from './Tabs'
import AuthMenu from '../screens/auth/AuthMenu'
import SelectWallet from '../screens/auth/SelectWallet'
import NewWalletStack from './NewWalletStack'
import RecoverWalletStack from './RecoverWalletStack'

import Setting from '../screens/Setting'
import ConnectView from '../screens/topup/ConnectView'
import SendTxView from '../screens/topup/SendTxView'
import Send from '../screens/Send'

import Complete from '../screens/Complete'
import VestingSchedule from '../screens/VestingSchedule'
import Confirm from '../screens/Confirm'
import ConfirmPassword from '../screens/ConfirmPassword'
import Delegate from '../screens/Delegate'
import ChangePassword from '../screens/ChangePassword'
import SendTxPasswordView from '../screens/topup/SendTxPasswordView'
import SendTxCompleteView from '../screens/topup/SendTxCompleteView'
import StakingInformation from '../screens/StakingInformation'

const TerraTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F9FAFF',
  },
}

const AppNavigator = (): ReactElement => {
  /* linking */
  const linking: LinkingOptions = {
    prefixes: ['terrastation://'],
    config: {
      screens: {
        ConnectView: {
          path: 'connect/:arg',
        },
        SendTxView: {
          path: 'sign/:arg',
        },
      },
    },
  }

  return (
    <NavigationContainer theme={TerraTheme} linking={linking}>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Tabs"
          component={Tabs}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <RootStack.Screen
          name="Setting"
          component={Setting}
          options={Setting.navigationOptions}
        />
        <RootStack.Screen
          name="AuthMenu"
          component={AuthMenu}
          options={AuthMenu.navigationOptions}
        />
        <RootStack.Screen
          name="SelectWallet"
          component={SelectWallet}
          options={SelectWallet.navigationOptions}
        />
        <RootStack.Screen
          name="NewWallet"
          component={NewWalletStack}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="RecoverWallet"
          component={RecoverWalletStack}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="ConnectView"
          component={ConnectView}
          options={{ headerShown: false, animationEnabled: false }}
        />
        <RootStack.Screen
          name="SendTxView"
          component={SendTxView}
          options={{ headerShown: false, animationEnabled: false }}
        />
        <RootStack.Screen
          name="SendTxPasswordView"
          component={SendTxPasswordView}
          options={{ headerShown: false, animationEnabled: false }}
        />
        <RootStack.Screen
          name="SendTxCompleteView"
          component={SendTxCompleteView}
          options={{ headerShown: false, animationEnabled: false }}
        />
        <RootStack.Screen
          name="Send"
          component={Send}
          options={Send.navigationOptions}
        />
        <RootStack.Screen
          name="Complete"
          component={Complete}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="VestingSchedule"
          component={VestingSchedule}
          options={VestingSchedule.navigationOptions}
        />
        <RootStack.Screen
          name="Confirm"
          component={Confirm}
          options={Confirm.navigationOptions}
        />
        <RootStack.Screen
          name="ConfirmPassword"
          component={ConfirmPassword}
          options={ConfirmPassword.navigationOptions}
        />
        <RootStack.Screen
          name="Delegate"
          component={Delegate}
          options={Delegate.navigationOptions}
        />
        <RootStack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={ChangePassword.navigationOptions}
        />
        <RootStack.Screen
          name="StakingInformation"
          component={StakingInformation}
          options={StakingInformation.navigationOptions}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
