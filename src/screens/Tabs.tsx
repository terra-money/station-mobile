import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import routes, { INITIAL } from '../../routes'

/* routes */
const Tab = createBottomTabNavigator()

const Tabs = () => (
  <Tab.Navigator
    initialRouteName={INITIAL}
    tabBarOptions={{
      activeTintColor: '#2043B5',
      inactiveTintColor: '#C1C7D0',
    }}
  >
    {routes.map((route) => (
      <Tab.Screen {...route} key={route.name} />
    ))}
  </Tab.Navigator>
)

export default Tabs
