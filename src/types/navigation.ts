import { createStackNavigator } from '@react-navigation/stack'
import { ChartKey } from '@terra-money/use-native-station'

export type AppStackParams = {
  Menu: undefined
  Auth: undefined
}

export const AppStack = createStackNavigator<AppStackParams>()

export type MenuStackParams = {
  Dashboard: undefined
  Market: undefined
}

export const MenuStack = createStackNavigator<MenuStackParams>()

export type AuthStackParams = {
  AuthMenu: undefined
  Select: undefined
  New: undefined
  Add: undefined
}

export const AuthStack = createStackNavigator<AuthStackParams>()

/* Dashboard */
export type DashboardRouteParams = {
  Dashboard: undefined
  Chart: { chartKey: ChartKey }
}

/* Staking */
export type StakingRouteParams = {
  Validator: { address: string }
}

/* Staking */
export type GovernanceRouteParams = {
  Governance: undefined
  Proposal: { id: string }
}
