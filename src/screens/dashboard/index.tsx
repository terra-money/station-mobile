import React, { ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { DashboardRouteParams } from '../../types/navigation'
import Chart from '../charts/Chart'
import Dashboard from './Dashboard'

const Stack = createStackNavigator<DashboardRouteParams>()

export default (): ReactElement => (
  <Stack.Navigator initialRouteName="Dashboard">
    <Stack.Screen
      name="Dashboard"
      component={Dashboard}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Chart" component={Chart} />
  </Stack.Navigator>
)
