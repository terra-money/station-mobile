import { Dictionary } from 'ramda'
import useTerraAssets from '../hooks/useTerraAssets'
import { Whitelist } from '../types'

const useWhitelist = (
  name: string
): {
  whitelist: Whitelist | undefined
  data: Dictionary<Whitelist> | undefined
  loading: boolean
  error: Error | undefined
} => {
  const response = useTerraAssets<Dictionary<Whitelist>>(
    'cw20/tokens.json'
  )
  return { ...response, whitelist: response.data?.[name] }
}

export default useWhitelist
