import React, { ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Send from '../screens/Send'
import Confirm from '../screens/Send/Confirm'

const Stack = createStackNavigator()

const StakingStack = (): ReactElement => (
  <Stack.Navigator initialRouteName="Send">
    <Stack.Screen
      name="Send"
      component={Send}
      options={Send.navigationOptions}
    />
    <Stack.Screen
      name="Confirm"
      component={Confirm}
      options={Confirm.navigationOptions}
    />
  </Stack.Navigator>
)

export default StakingStack
