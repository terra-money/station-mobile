import { QueryObserverResult, useQuery } from 'react-query'
import { DenomTrace } from '@terra-money/terra.js/dist/core/ibc-transfer/DenomTrace'

import { UTIL } from 'consts'

import { QueryKeyEnum } from 'types'
import useLCD from './useLCD'

export const useDenomTrace = (
  denom = ''
): QueryObserverResult<DenomTrace, unknown> => {
  const lcd = useLCD()
  const hash = denom.replace('ibc/', '')

  return useQuery(
    [QueryKeyEnum.denomTrace, hash],
    async () => {
      const { denom_trace } = ((await lcd.ibcTransfer.denomTrace(
        hash
      )) /* TODO: Remove force typing on terra.js fixed */ as unknown) as {
        denom_trace: DenomTrace
      }
      return denom_trace
    },
    { enabled: UTIL.isIbcDenom(denom) }
  )
}
