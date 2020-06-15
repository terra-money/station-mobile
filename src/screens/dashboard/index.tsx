import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { DashboardRouteParams } from '../../types/navigation'
import Chart from '../charts/Chart'
import Dashboard from './Dashboard'

const Stack = createStackNavigator<DashboardRouteParams>()

export default () => (
  <Stack.Navigator initialRouteName="Dashboard">
    <Stack.Screen name="Dashboard" component={Dashboard} />
    <Stack.Screen name="Chart" component={Chart} />
  </Stack.Navigator>
)
