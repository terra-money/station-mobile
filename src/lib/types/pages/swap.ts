type TerraAddress = string

/* coin | token */
type CoinDenom = string // uluna | uusd
type IBCDenom = string // ibc/...
type TokenAddress = TerraAddress
type Denom = CoinDenom | IBCDenom
type Token = Denom | TokenAddress

/* cw20: pair */
export type CW20Pairs = Record<TerraAddress, PairDetails>
export type Dex = "terraswap" | "astroport"
type PairType = "xyk" | "stable"
interface PairDetails {
  dex: Dex
  type: PairType
  assets: Pair
}

type Pair = [Token, Token]

export type Mode = 'Market' | 'Terraswap' | 'Astroport' | 'Route'

export enum SwapMode {
  ONCHAIN = 'Market',
  TERRASWAP = 'Terraswap',
  ASTROPORT = 'Astroport',
  ROUTESWAP = 'Route',
}

export enum DexType {
  TERRASWAP = 'terraswap',
  ASTROPORT = 'astroport',
}
