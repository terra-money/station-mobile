import { LCDClient } from '@terra-money/terra.js'
import { useMemo } from 'react'
import { useConfig } from '../lib/contexts/ConfigContext'

const useLCD = (): LCDClient => {
  const { chain } = useConfig()
  const { chainID, lcd: URL } = chain.current
  const lcd = useMemo(() => new LCDClient({ chainID, URL }), [
    chainID,
    URL,
  ])
  return lcd
}

export default useLCD
