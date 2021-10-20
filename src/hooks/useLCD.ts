import { LCDClient } from '@terra-money/terra.js'
import { useMemo } from 'react'
import { useConfig } from '../lib/contexts/ConfigContext'
import useGasPrices from './useGasPrices'

const useLCD = (): LCDClient => {
  const { chain } = useConfig()
  const { gasPrices } = useGasPrices()
  const { chainID, lcd: URL } = chain.current
  const lcd = useMemo(
    () =>
      new LCDClient({
        chainID,
        URL,
        gasPrices,
      }),
    [chainID, URL, gasPrices]
  )
  return lcd
}

export default useLCD
