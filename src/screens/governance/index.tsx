import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { GovernanceRouteParams } from '../../types/navigation'
import Governance from './Governance'
import Proposal from '../proposal/Proposal'

const Stack = createStackNavigator<GovernanceRouteParams>()

export default () => (
  <Stack.Navigator initialRouteName="Governance">
    <Stack.Screen name="Governance" component={Governance} />
    <Stack.Screen name="Proposal" component={Proposal} />
  </Stack.Navigator>
)
