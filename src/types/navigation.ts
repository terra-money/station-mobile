import { createStackNavigator } from '@react-navigation/stack'
import { StdSignMsg } from '@terra-money/terra.js'
import { Card, VestingItemUI } from 'use-station/src'

/* Root */
export type RootStackParams = {
  OnBoarding: undefined
  Tabs: undefined
  // Dashboard: undefined
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
  ConnectView: { arg?: string }
  SendTxView: { arg?: string }
  SendTxPasswordView: {
    stdSignMsg: StdSignMsg
    returnScheme: string
    endpointAddress: string
  }
  SendTxCompleteView: {
    success?: boolean
    title?: string
    content?: string
    button?: string
    onPress: () => void
  }
  Send: { denomOrToken: string }
  Complete: { result: Card }
  VestingSchedule: { item: VestingItemUI; title: string }
  Confirm: undefined
  ConfirmPassword: { feeSelectValue: string }
  Delegate: { validatorAddress: string; isUndelegation: boolean }
  ChangePassword: { walletName: string }
  StakingInformation: undefined
  WalletHistory: undefined
}

export const RootStack = createStackNavigator<RootStackParams>()
