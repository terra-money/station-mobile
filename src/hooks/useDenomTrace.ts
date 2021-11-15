import { QueryObserverResult, useQuery } from 'react-query'
import { DenomTrace } from '@terra-money/terra.js/dist/core/ibc-transfer/DenomTrace'

import { UTIL } from 'consts'

import { QueryKeyEnum } from 'types'
import useLCD from './useLCD'
import { LCDClient } from '@terra-money/terra.js'

export const useDenomTrace = (
  denom = ''
): QueryObserverResult<DenomTrace, unknown> => {
  const lcd = useLCD()
  const hash = denom.replace('ibc/', '')

  return useQuery(
    [QueryKeyEnum.denomTrace, hash],
    async () => {
      const denom_trace = await lcd.ibcTransfer.denomTrace(hash)
      return denom_trace
    },
    { enabled: UTIL.isIbcDenom(denom) }
  )
}

export const getTraceDenom = async (
  lcd: LCDClient,
  denom = ''
): Promise<string> => {
  try {
    const hash = denom.replace('ibc/', '')
    const denom_trace = await lcd.ibcTransfer.denomTrace(hash)

    return denom_trace.base_denom ?? denom
  } catch (e) {
    return denom
  }
}
