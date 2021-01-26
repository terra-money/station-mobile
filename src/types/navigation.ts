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
  Complete: { result: Card }
  VestingSchedule: { item: VestingItemUI; title: string }
  Confirm: undefined
  ConfirmPassword: { feeSelectValue: string }
  Delegate: { validatorAddress: string; isUndelegation: boolean }
}

export const RootStack = createStackNavigator<RootStackParams>()
