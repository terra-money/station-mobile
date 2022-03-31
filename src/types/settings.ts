import { LangKey, ChainOptions, ThemeType } from 'lib'

export interface Settings {
  lang?: LangKey
  chain?: ChainOptions
  walletName?: string
  currency?: string
  theme?: ThemeType
}
