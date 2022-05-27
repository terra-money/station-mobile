import { useMemo } from 'react'
import { LCDClient } from '@terra-money/terra.js'
import { useConfig, useIsClassic } from 'lib/contexts/ConfigContext'

const useLCD = () => {
  const { chain } = useConfig()
  const isClassic = useIsClassic()

  const lcdClient = useMemo(
    () => new LCDClient({
        chainID: chain.current.chainID,
        URL: chain.current.lcd,
        isClassic,
      }),
    [chain, isClassic]
  )

  return lcdClient
}

export default useLCD
