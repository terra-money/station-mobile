import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import _ from 'lodash'

import Dashboard from '../screens/homeTab/Dashboard'
import Wallet from '../screens/walletTab/Wallet'
import Swap from '../screens/swapTab/Swap'

import { RootStack } from 'types/navigation'
import Staking from '../screens/stakingTab/Staking'
import StakingPersonal from '../screens/stakingTab/StakingPersonal'
import ValidatorDetail from '../screens/stakingTab/ValidatorDetail'
import { Text, Icon } from 'components'
import layout from 'styles/layout'

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
      name="StakingPersonal"
      component={StakingPersonal}
      options={StakingPersonal.navigationOptions}
    />
    <RootStack.Screen
      name="ValidatorDetail"
      component={ValidatorDetail}
      options={ValidatorDetail.navigationOptions}
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
  </RootStack.Navigator>
)

const isTabBarVisible = (route: any): boolean => {
  const routeName = getFocusedRouteNameFromRoute(route)
  if (routeName && ['StakingPersonal'].includes(routeName)) {
    return false
  }

  return true
}

const styles = StyleSheet.create({
  tabbar_text: {
    fontSize: 8,
    marginBottom: 3,
  },
})

/* routes */
const Tab = createBottomTabNavigator()

const tabScreenItemList: {
  name: string
  component: () => ReactElement
  label: string
  iconName: string
}[] = [
  {
    name: 'Dashboard',
    component: DashboardStack,
    label: 'DASHBOARD',
    iconName: 'dashboard',
  },
  {
    name: 'Wallet',
    component: WalletStack,
    label: 'WALLET',
    iconName: 'account-balance-wallet',
  },
  {
    name: 'Staking',
    component: StakingStack,
    label: 'STAKING',
    iconName: 'layers',
  },
  {
    name: 'Swap',
    component: SwapStack,
    label: 'SWAP',
    iconName: 'swap-horiz',
  },
]

const Tabs = (): ReactElement => {
  const labelPosition =
    layout.getScreenWideType() === 'wide'
      ? 'beside-icon'
      : 'below-icon'
  return (
    <Tab.Navigator
      initialRouteName={INITIAL}
      tabBarOptions={{
        activeTintColor: '#2043B5',
        inactiveTintColor: '#C1C7D0',
        labelPosition,
      }}
    >
      {_.map(tabScreenItemList, (item, index) => (
        <Tab.Screen
          key={`tabScreenItemList-${index}`}
          name={item.name}
          component={item.component}
          options={({ route }): BottomTabNavigationOptions => ({
            tabBarLabel:
              labelPosition === 'below-icon'
                ? ({ color }: { color: string }): ReactElement => (
                    <Text
                      style={[styles.tabbar_text, { color }]}
                      fontType={'bold'}
                    >
                      {item.label}
                    </Text>
                  )
                : item.label,
            tabBarIcon: ({ color }: any): ReactElement => (
              <Icon
                name={item.iconName}
                color={color}
                size={26}
                style={
                  labelPosition === 'below-icon' && { marginTop: 5 }
                }
              />
            ),
            tabBarVisible: isTabBarVisible(route),
          })}
        />
      ))}
    </Tab.Navigator>
  )
}

export default Tabs
