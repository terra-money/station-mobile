import React, { ReactElement } from 'react'

import { ConnectLedgerStack } from '../types'

import SelectDevice from '../screens/auth/ConnectLedger/SelectDevice'
import SelectPath from '../screens/auth/ConnectLedger/SelectPath'
import LedgerConnected from '../screens/auth/ConnectLedger/LedgerConnected'

const LedgerStack = (): ReactElement => (
  <ConnectLedgerStack.Navigator initialRouteName="SelectDevice">
    <ConnectLedgerStack.Screen
      name="SelectDevice"
      component={SelectDevice}
      options={SelectDevice.navigationOptions}
    />
    <ConnectLedgerStack.Screen
      name="SelectPath"
      component={SelectPath}
      options={SelectPath.navigationOptions}
    />
    <ConnectLedgerStack.Screen
      name="LedgerConnected"
      component={LedgerConnected}
      options={{ headerShown: false }}
    />
  </ConnectLedgerStack.Navigator>
)

export default LedgerStack

