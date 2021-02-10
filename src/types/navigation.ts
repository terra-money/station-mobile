import { createStackNavigator } from '@react-navigation/stack'
import { Card, VestingItemUI } from 'use-station/src'

/* Auth */
export type AuthStackParams = {
  AuthMenu: undefined
  SelectWallet: undefined
  NewWallet: undefined
  RecoverWallet: undefined
}

export const AuthStack = createStackNavigator<AuthStackParams>()

/* CreateWallet */
export type CreateWalletStackParams = {
  Step1: undefined
  Step2: undefined
  Step3: undefined
  WalletCreated: { wallet: LocalWallet }
}

export const CreateWalletStack = createStackNavigator<CreateWalletStackParams>()

/* RecoverWallet */
export type RecoverWalletStackParams = {
  Step1: undefined
  Step2QR: undefined
  Step2Seed: undefined
  Step3Seed: undefined
  Step4Seed: undefined
  WalletRecovered: { wallet: LocalWallet }
}

export const RecoverWalletStack = createStackNavigator<RecoverWalletStackParams>()

/* Root */
export type RootStackParams = {
  Tabs: undefined
  // Dashboard: undefined
  Wallet: undefined
  Staking: undefined
  StakingPersonal: undefined
  ValidatorDetail: { address: string }
  Swap: undefined

  Setting: undefined
  ConnectView: { payload?: string }
  SendTxView: { payload?: string }
  SendTxPasswordView: {
    returnScheme: string
    endpointAddress: string
  }
  SendTxCompleteView: {
    success?: boolean
    title?: string
    content?: string
    button?: string
    returnScheme: string
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
