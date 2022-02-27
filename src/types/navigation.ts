import { createStackNavigator } from '@react-navigation/stack'
import { BankData, Card, Pairs, VestingItemUI } from 'lib'
import { DelegateType } from 'lib/post/useDelegate'
import { TxParam } from './tx'

/* Auth */
export type AuthStackParams = {
  AuthMenu: undefined
  SelectWallet: undefined
  NewWallet: undefined
  RecoverWallet: undefined
  WalletConnectDisconnected: undefined
  ConnectLedger: undefined
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
  Step2QR?: { payload?: string }
  Step2Seed: undefined
  Step3Seed: undefined
  Step4Seed: undefined
  WalletRecovered: { wallet: LocalWallet }
}

export const RecoverWalletStack = createStackNavigator<RecoverWalletStackParams>()

/* ConnectLedger */
export type ConnectLedgerStackParams = {
  SelectDevice: undefined
  SelectPath: { device: string }
  LedgerConnected: { wallet: LocalWallet }
}

export const ConnectLedgerStack = createStackNavigator<ConnectLedgerStackParams>()

/* Root */
export type RootStackParams = {
  Tabs: undefined
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
  Send: {
    denomOrToken: string
    toAddress?: string
    memo?: string
    amount?: string
  }
  Complete: { result: Card }
  VestingSchedule: { item: VestingItemUI; title: string }
  SwapMultipleCoins: {
    bank?: BankData
    pairs?: Pairs
  }
  Confirm: undefined
  ConfirmPassword: { feeSelectValue: string }
  Delegate: { validatorAddress: string; type: DelegateType }
  ChangePassword: { walletName: string }
  StakingInformation: undefined
  WalletHistory: undefined
  AutoLogout: undefined
  Password: { navigateAfter: keyof RootStackParams }
  ExportWallet: undefined
  ExportPrivateKey: undefined
  WalletConnect: { payload?: string; uri?: string }
  WalletConnectConfirm: {
    handshakeTopic: string
    id: number
    params: TxParam
  }
  WalletConnectConfirmPassword: {
    handshakeTopic: string
    id: number
    tx: TxParam
  }
  WalletConnectList: undefined
  SelectCoinToSend: { toAddress?: string } | undefined

  // AppScheme page for Send page
  LinkingError: { errorMessage?: string }
  LinkingSend: {
    payload: string
  }
  LinkingWalletConnect: {
    payload: string
  }
  LinkingWalletConnectConfirm: {
    payload: string
  }
  WalletConnectDisconnected: undefined
}

export const RootStack = createStackNavigator<RootStackParams>()
