import { Dictionary } from 'ramda'
import useTerraAssets from '../hooks/useTerraAssets'
import { Pairs } from '../types'

const usePairs = (
  name: string
): {
  pairs?: Pairs
  data?: Dictionary<Pairs>
  loading: boolean
  error: unknown
} => {
  const response = useTerraAssets<Dictionary<Pairs>>(
    'cw20/pairs.json'
  )
  return { ...response, pairs: response.data?.[name] }
}

export default usePairs
