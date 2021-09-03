import { Rate, useConfig } from 'lib'
import useFCD from 'lib/api/useFCD'

export const useSwapRate = (): {
  loading: boolean
  error?: Error | undefined
  data?: Rate[] | undefined
  execute: () => Promise<void>
} => {
  const { currency } = useConfig()
  const swapRateApi = useFCD<Rate[]>({
    url: `/v1/market/swaprate/${currency.current?.key}`,
  })

  return { ...swapRateApi }
}
