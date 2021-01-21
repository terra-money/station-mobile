import React, { ReactElement } from 'react'
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'

import Dashboard from '../screens/homeTab/Dashboard'
import Wallet from '../screens/walletTab/Wallet'
import Swap from '../screens/swapTab/Swap'
import SwapConfirm from '../screens/swapTab/Swap/Confirm'

// import Governance from '../screens/governance'
import Icon from 'components/Icon'
import EStyleSheet from 'react-native-extended-stylesheet'

import { RootStack } from 'types/navigation'
import Staking from '../screens/stakingTab/Staking'
import validatorDetail from '../screens/stakingTab/ValidatorDetail'
import Text from 'components/Text'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

export const INITIAL = 'Dashboard'

const DashboardStack = (): ReactElement => (
  <RootStack.Navigator initialRouteName={INITIAL}>
    <RootStack.Screen
      name={INITIAL}
      component={Dashboard}
      options={Dashboard.navigationOptions}
    />
  </RootStack.Navigator>
)

const WalletStack = (): ReactElement => (
  <RootStack.Navigator initialRouteName="Wallet">
    <RootStack.Screen
      name="Wallet"
      component={Wallet}
      options={Wallet.navigationOptions}
    />
  </RootStack.Navigator>
)

const StakingStack = (): ReactElement => (
  <RootStack.Navigator initialRouteName="Staking">
    <RootStack.Screen
      name="Staking"
      component={Staking}
      options={Staking.navigationOptions}
    />
    <RootStack.Screen
      name="ValidatorDetail"
      component={validatorDetail}
      options={validatorDetail.navigationOptions}
    />
  </RootStack.Navigator>
)

const SwapStack = (): ReactElement => (
  <RootStack.Navigator initialRouteName="Swap">
    <RootStack.Screen
      name="Swap"
      component={Swap}
      options={Swap.navigationOptions}
    />
    <RootStack.Screen
      name="SwapConfirm"
      component={SwapConfirm}
      options={SwapConfirm.navigationOptions}
    />
  </RootStack.Navigator>
)

const isTabBarVisible = (route: any): boolean => {
  const routeName = getFocusedRouteNameFromRoute(route)
  if (routeName && ['SwapConfirm'].includes(routeName)) {
    return false
  }

  return true
}

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
    <Tab.Screen
      name="Dashboard"
      component={DashboardStack}
      options={{
        tabBarLabel: ({ color }: any): ReactElement => (
          <Text style={[styles.tabbar_text, { color }]}>
            DASHBOARD
          </Text>
        ),
        tabBarIcon: ({ color }: any): ReactElement => (
          <Icon
            name="dashboard"
            color={color}
            size={26}
            style={{ marginTop: 5 }}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Wallet"
      component={WalletStack}
      options={{
        tabBarLabel: ({ color }: any): ReactElement => (
          <Text style={[styles.tabbar_text, { color }]}>WALLET</Text>
        ),
        tabBarIcon: ({ color }: any): ReactElement => (
          <Icon
            name="account-balance-wallet"
            color={color}
            size={28}
            style={{ marginTop: 5 }}
          />
        ),
      }}
    />

    <Tab.Screen
      name="Staking"
      component={StakingStack}
      options={{
        tabBarLabel: ({ color }: any): ReactElement => (
          <Text style={[styles.tabbar_text, { color }]}>STAKING</Text>
        ),
        tabBarIcon: ({ color }: any): ReactElement => (
          <Icon
            name="layers"
            color={color}
            size={28}
            style={{ marginTop: 5 }}
          />
        ),
      }}
    />

    <Tab.Screen
      name="Swap"
      component={SwapStack}
      options={({ route }): BottomTabNavigationOptions => ({
        tabBarLabel: ({ color }: any): ReactElement => (
          <Text style={[styles.tabbar_text, { color }]}>Swap</Text>
        ),
        tabBarIcon: ({ color }: any): ReactElement => (
          <Icon
            name="swap-horiz"
            color={color}
            size={28}
            style={{ marginTop: 5 }}
          />
        ),
        tabBarVisible: isTabBarVisible(route),
      })}
    />
  </Tab.Navigator>
)

export default Tabs
