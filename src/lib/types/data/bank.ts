import { API } from '..'

export type BankAPI = API<BankData>

export interface BankData {
  balance: Balance[]
  vesting: Vesting[]
  delegations: Delegation[]
  unbondings: Unbonding[]
}

export interface BankDataV2 {
  account: Account
  delegations: Delegation[]
  unbondings: Unbonding[]
  balance: BalanceV2[]
  vesting: Vesting[]
}

export interface Account {
  account: AccountDetail
  balances: BalanceV2[]
}

export interface AccountDetail {
  '@type': string
  address?: string
  pub_key?: {
    '@type': string
    key: string
  }
  account_number?: string
  sequence?: string
  base_vesting_account?: {
    base_account: {
      address: string
      pub_key: {
        '@type': string
        key: string
      }
      account_number: string
      sequence: string
    }
    original_vesting: BalanceV2[]
    delegated_free: BalanceV2[]
    delegated_vesting: BalanceV2[]
    end_time: string
  }
  start_time?: string
  vesting_periods?: VestingPeriod[]
}

export interface VestingPeriod {
  length: string
  amount: BalanceV2[]
}

export interface BalanceV2 {
  denom: string
  amount: string
}

export interface Balance {
  denom: string
  available: string
  delegatable: string
}

export interface Vesting {
  denom: string
  total: string
  schedules: Schedule[]
}

export interface Schedule {
  amount: string
  startTime: number
  endTime: number
  ratio: number
  freedRate?: number
}

export interface Delegation {
  delegator_address: string
  validator_address: string
  amount: string
}

export interface Unbonding {
  delegator_address: string
  validator_address: string
}
