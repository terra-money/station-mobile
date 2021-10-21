import { Dictionary } from 'ramda'
import { DisplayCoin, Card, BankAPI } from '..'

export interface AssetsPage extends BankAPI {
  ui?: AssetsUI
  setHideSmall: (hide: boolean) => void
  load: () => void
}

export interface AssetsUI {
  card?: Card
  available?: TerraNativeUI
  ibc?: IbcNativeUI
  tokens: AvailableTokenUI
  vesting?: VestingUI
}

export interface TerraNativeUI {
  title: string
  list: AvailableItem[]
  hideSmall: HideSmallUI
  send: string
}

export interface IbcNativeUI {
  title: string
  list: AvailableItem[]
  send: string
}

export interface AvailableTokenUI {
  title: string
  list: AvailableItem[]
  send: string
}

export interface HideSmallUI {
  label: string
  checked: boolean
  toggle: () => void
}

export interface AvailableItem {
  icon?: string
  denom?: string
  token?: string
  display: DisplayCoin
}

export interface VestingUI {
  title: string
  desc: string
  list: VestingItemUI[]
}

export interface VestingItemUI {
  display: DisplayCoin
  schedule: ScheduleUI[]
}

export interface ScheduleUI {
  released: boolean
  releasing: boolean
  percent: string
  display: DisplayCoin
  status: string
  duration: string
  width: string
}

/* cw20 */
export interface Token {
  symbol: string
  icon?: string
  token: string
  decimals?: number
}

export interface TokenBalance extends Token {
  balance: string
}

export type Tokens = Dictionary<Token>

/* contracts */
export interface ContractInfo {
  protocol: string
  name: string
  icon?: string
}
