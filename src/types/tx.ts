export type TxParam = {
  msgs: string[]
  fee: string | undefined
  memo: string | undefined
  gasPrices: string | undefined
  gasAdjustment: string | undefined
  account_number: number | undefined
  sequence: number | undefined
  feeDenoms: string[] | undefined
}
