import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Staking from './Staking'
import Validator from '../validator/Validator'

const Stack = createStackNavigator()

export default () => (
  <Stack.Navigator initialRouteName="Staking">
    <Stack.Screen name="Staking" component={Staking} options={{headerShown: false}} />
    <Stack.Screen name="Validator" component={Validator} options={{headerShown: false}} />
  </Stack.Navigator>
)
