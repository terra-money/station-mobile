import { Coin } from '@terra-money/terra.js'
import { UTIL } from 'consts'
import { uToken } from 'types'
import useLCD from './useLCD'

export const useSwapRate = (): {
  getSwapAmount: (
    offerCoin: Coin,
    askDenom: string
  ) => Promise<uToken>
} => {
  const lcd = useLCD()

  const getSwapAmount = async (
    offerCoin: Coin,
    askDenom: string
  ): Promise<uToken> => {
    if (
      offerCoin.denom === askDenom ||
      UTIL.isIbcDenom(offerCoin.denom)
    ) {
      return '' as uToken
    }

    const result = await lcd.market.swapRate(offerCoin, askDenom)
    return result.amount.toString() as uToken
  }

  return { getSwapAmount }
}
