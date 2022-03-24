import { Dictionary } from 'ramda'
import useTerraAssets from '../hooks/useTerraAssets'
import { CW20Pairs } from '../types'

const usePairs = (
  name: string
): {
  pairs?: CW20Pairs
  data?: Dictionary<CW20Pairs>
  loading: boolean
  error: unknown
} => {
  const response = useTerraAssets<Dictionary<CW20Pairs>>(
    'cw20/pairs.dex.json'
  )
  return { ...response, pairs: response.data?.[name] }
}

export default usePairs
