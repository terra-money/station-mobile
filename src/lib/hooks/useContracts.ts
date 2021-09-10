import { Dictionary } from 'ramda'
import useTerraAssets from '../hooks/useTerraAssets'
import { Contracts } from '../types'

const useContracts = (
  name: string
): {
  contracts: Contracts | undefined
  data?: Dictionary<Contracts> | undefined
  loading: boolean
  error: unknown
} => {
  const response = useTerraAssets<Dictionary<Contracts>>(
    'cw20/contracts.json'
  )
  return { ...response, contracts: response.data?.[name] }
}

export default useContracts
