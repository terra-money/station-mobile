import { NavigatorScreenParams } from '@react-navigation/native'
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
  SwapConfirm: undefined

  Setting: undefined
  AuthMenu: undefined
  SelectWallet: undefined
  NewWallet: undefined
  RecoverWallet: undefined
  ConnectView: undefined
  SendTxView: undefined
  Send: NavigatorScreenParams<SendStackParams>
  Complete: { result: Card; confirmNavigateTo: keyof RootStackParams }
  VestingSchedule: { item: VestingItemUI; title: string }
}

export const RootStack = createStackNavigator<RootStackParams>()

/* Send */
export type SendStackParams = {
  Send: { denomOrToken: string }
  Confirm: undefined
}

export const SendStack = createStackNavigator<SendStackParams>()
