import { NavigatorScreenParams } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Card } from 'use-station/src'

/* Root */
export type RootStackParams = {
  OnBoarding: undefined
  Tabs: undefined
  Dashboard: undefined
  Wallet: undefined
  Staking: undefined
  ValidatorDetail: undefined
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
}

export const RootStack = createStackNavigator<RootStackParams>()

/* Send */
export type SendStackParams = {
  Send: { denom: string }
  Confirm: undefined
}

export const SendStack = createStackNavigator<SendStackParams>()
