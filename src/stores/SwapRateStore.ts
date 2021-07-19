import { atom, selectorFamily } from 'recoil'
import _ from 'lodash'
import { Rate } from 'use-station/src'
import { StoreKeyEnum } from './StoreKeyEnum'
import BigNumber from 'bignumber.js'

const swapRate = atom<Rate[]>({
  key: StoreKeyEnum.swapRate,
  default: [],
})

const swapValue = selectorFamily<
  string,
  { denom: string; value: string }
>({
  key: StoreKeyEnum.swapValue,
  get: ({ denom, value }) => {
    return ({ get }): string => {
      const rate = get(swapRate)
      const targetRate = _.find(rate, (x) => x.denom === denom)

      if (targetRate) {
        return new BigNumber(value)
          .div(targetRate.swaprate)
          .decimalPlaces(6, BigNumber.ROUND_DOWN)
          .toString()
      }
      return ''
    }
  },
})

export default {
  swapRate,
  swapValue,
}
