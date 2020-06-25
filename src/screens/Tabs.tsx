import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import routes, { INITIAL } from '../../routes'

/* routes */
const Tab = createBottomTabNavigator()

const Tabs = () => (
  <Tab.Navigator initialRouteName={INITIAL}>
    {routes.map((route) => (
      <Tab.Screen {...route} key={route.name} />
    ))}
  </Tab.Navigator>
)

export default Tabs
