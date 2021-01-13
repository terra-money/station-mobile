import React, { ReactElement } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { Text } from 'react-native'

import Dashboard from '../screens/dashboard'
import Bank from '../screens/bank/Bank'
import Market from '../screens/market/Market'
import Governance from '../screens/governance'
import Icon from 'react-native-vector-icons/MaterialIcons'
import EStyleSheet from 'react-native-extended-stylesheet'

import Staking from '../screens/staking'
import validatorDetail from '../screens/validatorDetail'

export const INITIAL = 'Dashboard'

const Stack = createStackNavigator()

const StakingStack = () => (
  <Stack.Navigator initialRouteName="Staking">
    <Stack.Screen
      name="Staking"
      component={Staking}
      options={Staking.navigationOptions}
    />
    <Stack.Screen
      name="ValidatorDetail"
      component={validatorDetail}
      options={validatorDetail.navigationOptions}
    />
  </Stack.Navigator>
)

const tabScreenList = [
  {
    name: 'Dashboard',
    component: Dashboard,
    options: {
      tabBarLabel: ({ color }: any) => (
        <Text style={[styles.tabbar_text, { color: color }]}>
          DASHBOARD
        </Text>
      ),
      tabBarIcon: ({ color }: any) => (
        <Icon
          name="dashboard"
          color={color}
          size={26}
          style={{ marginTop: 5 }}
        />
      ),
    },
  },
  {
    name: 'Bank',
    component: Bank,
    options: {
      tabBarLabel: ({ color }: any) => (
        <Text style={[styles.tabbar_text, { color: color }]}>
          BANK
        </Text>
      ),
      tabBarIcon: ({ color }: any) => (
        <Icon
          name="account-balance"
          color={color}
          size={28}
          style={{ marginTop: 5 }}
        />
      ),
    },
  },
  {
    name: 'Staking',
    component: StakingStack,
    options: {
      tabBarLabel: ({ color }: any) => (
        <Text style={[styles.tabbar_text, { color: color }]}>
          STAKING
        </Text>
      ),
      tabBarIcon: ({ color }: any) => (
        <Icon
          name="layers"
          color={color}
          size={28}
          style={{ marginTop: 5 }}
        />
      ),
    },
  },
  {
    name: 'Market',
    component: Market,
    options: {
      tabBarLabel: ({ color }: any) => (
        <Text style={[styles.tabbar_text, { color: color }]}>
          MARKET
        </Text>
      ),
      tabBarIcon: ({ color }: any) => (
        <Icon
          name="timeline"
          color={color}
          size={28}
          style={{ marginTop: 5 }}
        />
      ),
    },
  },
  {
    name: 'Governance',
    component: Governance,
    options: {
      tabBarLabel: ({ color }: any) => (
        <Text style={[styles.tabbar_text, { color: color }]}>
          GOVERNANCE
        </Text>
      ),
      tabBarIcon: ({ color }: any) => (
        <Icon
          name="how-to-vote"
          color={color}
          size={28}
          style={{ marginTop: 5 }}
        />
      ),
    },
  },
]

const styles = EStyleSheet.create({
  tabbar_text: {
    fontSize: 8,
    fontFamily: '$fontGothamBold',
    marginBottom: 3,
  },
})

/* routes */
const Tab = createBottomTabNavigator()

const Tabs = (): ReactElement => (
  <Tab.Navigator
    initialRouteName={INITIAL}
    tabBarOptions={{
      activeTintColor: '#2043B5',
      inactiveTintColor: '#C1C7D0',
    }}
  >
    {tabScreenList.map((route) => (
      <Tab.Screen {...route} key={route.name} />
    ))}
  </Tab.Navigator>
)

export default Tabs
