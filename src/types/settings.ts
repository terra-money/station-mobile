import { LangKey, ChainOptions } from 'lib'

export interface Settings {
  lang?: LangKey
  chain?: ChainOptions
  walletName?: string
  currency?: string
}
