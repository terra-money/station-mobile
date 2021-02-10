import React, { ReactElement } from 'react'

import { RootStack } from '../types'

import Tabs from './Tabs'

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
import WalletHistory from '../screens/WalletHistory'
import StakingPersonal from '../screens/StakingPersonal'
import ValidatorDetail from '../screens/ValidatorDetail'
import AutoLogout from '../screens/AutoLogout'

const AppNavigator = (): ReactElement => {
  return (
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
      <RootStack.Screen
        name="WalletHistory"
        component={WalletHistory}
        options={WalletHistory.navigationOptions}
      />
      <RootStack.Screen
        name="StakingPersonal"
        component={StakingPersonal}
        options={StakingPersonal.navigationOptions}
      />
      <RootStack.Screen
        name="ValidatorDetail"
        component={ValidatorDetail}
        options={ValidatorDetail.navigationOptions}
      />
      <RootStack.Screen
        name="AutoLogout"
        component={AutoLogout}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  )
}

export default AppNavigator
