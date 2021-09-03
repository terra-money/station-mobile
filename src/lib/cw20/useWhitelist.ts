import { useCurrentChainName } from 'lib/contexts/ConfigContext'
import { Dictionary } from 'ramda'
import useTerraAssets from '../hooks/useTerraAssets'
import { Whitelist } from '../types'

const useWhitelist = (): {
  whitelist: Whitelist
  loading: boolean
} => {
  const name = useCurrentChainName()
  const response = useTerraAssets<Dictionary<Whitelist>>(
    'cw20/tokens.json'
  )
  return {
    loading: response.loading,
    whitelist: response.data?.[name] || {},
  }
}

export default useWhitelist
