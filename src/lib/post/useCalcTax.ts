import { useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'
import { TFunction } from 'i18next'
import BigNumber from 'bignumber.js'
import { percent } from 'lib/utils/math'
import fcd from 'lib/api/fcd'
import { format, is } from 'lib/utils'
import { Result } from 'lib/types'

type Response = Result<string>
const useCalcTax = (
  denom: string,
  t: TFunction
): {
  loading: boolean
  getMax: (balance: string) => string
  getTax: (amount: string) => string
  label: string
} => {
  const { data: rate = '0', isLoading: loadingRate } = useQuery(
    'taxRate',
    async () => {
      const { data } = await fcd.get<Response>('/treasury/tax_rate')
      return data.result
    }
  )

  const { data: cap = '0', isLoading: loadingCap } = useQuery(
    ['taxCap', denom],
    async () => {
      const { data } = await fcd.get<Response>(
        `/treasury/tax_cap/${denom}`
      )
      return data.result
    },
    {
      enabled: !(
        denom === 'uluna' ||
        is.ibcDenom(denom) ||
        is.address(denom)
      ),
    }
  )

  const loading = loadingRate || loadingCap

  const getMax = useCallback(
    (balance: string) => {
      const tax = getTax(balance)

      return new BigNumber(balance).minus(tax).toString()
    },
    [rate, cap]
  )

  const getTax = useCallback(
    (amount: string) => {
      const bn = is.ibcDenom(denom)
        ? new BigNumber(amount).times(rate)
        : BigNumber.min(
            new BigNumber(amount).times(rate),
            new BigNumber(cap)
          )

      return bn.integerValue(BigNumber.ROUND_CEIL).toString()
    },
    [cap, rate, denom]
  )

  const label = useMemo(
    () =>
      t('Post:Send:Tax ({{percent}}, Max {{max}})', {
        percent: percent(rate, 3),
        max: format.coin({ amount: cap, denom }),
      }),
    [cap, rate, denom, t]
  )

  return { loading, getMax, getTax, label }
}

export default useCalcTax
