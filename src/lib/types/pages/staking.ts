import { Validator, UnbondingDelegation, Delegation, Rewards } from '@terra-money/terra.js'
import { QueryObserverBaseResult } from 'react-query'

import {
  DisplayCoin,
} from '..'
import { TerraValidator } from 'types/validator'

export interface StakingPage {
  personal?: StakingData
  ui?: StakingUI
  validatorsState?: QueryObserverBaseResult<any>
  delegationsState?: QueryObserverBaseResult<any>
  unbondingsState?: QueryObserverBaseResult<any>
  rewardsState?: QueryObserverBaseResult<any>
  TerraValidatorsState?: QueryObserverBaseResult<any>
}

export interface StakingPersonal {
  withdrawAll: {
    attrs: { children: string; disabled: boolean }
    amounts: DisplayCoin[]
    validators: string[]
  }
  available?: { title: string; display: DisplayCoin }
  delegated: { title: string; display: DisplayCoin }
  undelegated: {
    title: string
    display: DisplayCoin
    table?: UndelegationsTable
  }
  rewards: {
    title: string
    display: DisplayCoin
    table?: RewardsTable
    desc: { header: string; contents: string[]; footer: string }
  }
  myDelegations?: MyDelegations
  myRewards?: MyDelegations
}

export interface StakingUI {
  sorter?: {
    current: ValidatorSorter & { asc: boolean }
    set: (sorter: ValidatorSorter, asc: boolean) => void
  }
  headings: ValidatorListHeadings
  contents: TerraValidator[]
}

export interface UndelegationsTable {
  headings: { name: string; display: string; date: string }
  contents: { name: string; display: DisplayCoin; date: string }[]
}

export interface RewardsTable {
  headings: DisplayCoin
  contents: DisplayCoin[]
}

export interface MyDelegations {
  title: string
  sum: DisplayCoin
  table: MyDelegationsTable
  chart: { label: string; data: number }[]
}

export interface MyDelegationsTable {
  headings: { name: string; delegated: string; rewards: string }
  contents: MyDelegationsContent[]
}

export interface MyDelegationsContent {
  address: string
  name: string
  delegated: DisplayCoin
  rewards: DisplayCoin
}

export interface ValidatorSorter {
  prop: string
  isString?: boolean
}

export interface ValidatorListSorter {
  prop: string
  isString?: boolean
}

export interface ValidatorListHeadings {
  rank: ValidatorListHeading
  moniker: ValidatorListHeading
  votingPower: ValidatorListHeading
  selfDelegation: ValidatorListHeading
  commission: ValidatorListHeading
  uptime: ValidatorListHeading
  myDelegation: ValidatorListHeading
}

export interface ValidatorListHeading {
  title: string
  sorter?: ValidatorListSorter
}

/* data */
export interface StakingData {
  availableLuna?: string
  delegationTotal?: string
  undelegations?: Undelegation[]
  myDelegations?: Delegation[]
  validators: Validator[]
  delegations?: Delegation[]
  unbondings?: UnbondingDelegation[]
  rewards?: Rewards
}

export interface StakingDelegation {
  validatorAddress: string
  validatorName: string
  amountDelegated: string
  totalReward?: string
}

export interface Undelegation {
  validatorName: string
  amount: string
  releaseTime: string
}
