import { NetworkEnum } from 'types'

export interface Config {
  lang: LangConfig
  currency: CurrencyConfig
  chain: ChainConfig
  theme: ThemeConfig
}

export interface InitialConfigState {
  lang?: LangKey
  currency?: string
  theme?: ThemeType
  chain: ChainOptions
}

/*  theme */
export type ThemeType =
  | 'light'
  | 'dark'
  | 'blossom'
  | 'moon'
  | 'whale'
  | 'madness'

export interface Theme {
  textContent: string
  backgroundColor: string
  cardColor: string
  primaryColor: string
  primaryText: string
}

export interface ThemeConfig {
  current: ThemeType
  set: (key: ThemeType) => void
}

/* lang */
export type LangKey = 'en' | 'es' | 'zh' | 'fr' | 'ru' | 'pl'

export interface LangConfig {
  current?: LangKey
  list: LangKey[]
  set: (key: LangKey) => void
}

/* currency */
export interface Currency {
  key: string
  value: string
  krwRate?: string
}

export interface CurrencyConfig {
  current?: Currency
  list?: Currency[]
  loading: boolean
  set: (key: string) => void
}

/* chain */
export interface ChainOptions {
  name: NetworkEnum
  chainID: string
  lcd: string
  fcd: string
  mantle: string
  walletconnectID: number
}

export interface ChainConfig {
  current: ChainOptions
  set: (options: ChainOptions) => void
}

export interface HeightData {
  formatted: string
  link: string
}
