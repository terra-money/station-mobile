import { useCurrentChainName } from 'lib/contexts/ConfigContext'
import useTerraAssets from './useTerraAssets'

const useIBCWhitelist = (): {
  whitelist: IBCWhitelist
  loading: boolean
} => {
  const name = useCurrentChainName()
  const response = useTerraAssets<Dictionary<IBCWhitelist>>(
    'ibc/tokens.json'
  )
  return {
    loading: response.loading,
    whitelist: response.data?.[name] || {},
  }
}

export default useIBCWhitelist
