import { createStackNavigator } from '@react-navigation/stack'
import { Card, VestingItemUI } from 'use-station/src'

/* Root */
export type RootStackParams = {
  OnBoarding: undefined
  Tabs: undefined
  Dashboard: undefined
  Wallet: undefined
  Staking: undefined
  StakingPersonal: undefined
  ValidatorDetail: { address: string }
  Swap: undefined

  Setting: undefined
  AuthMenu: undefined
  SelectWallet: undefined
  NewWallet: undefined
  RecoverWallet: undefined
  ConnectView: undefined
  SendTxView: undefined
  Send: { denomOrToken: string }
  Complete: { result: Card; confirmNavigateTo: keyof RootStackParams }
  VestingSchedule: { item: VestingItemUI; title: string }
  Confirm: { confirmNavigateTo: keyof RootStackParams }
}

export const RootStack = createStackNavigator<RootStackParams>()
