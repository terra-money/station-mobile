import { Dictionary } from 'ramda'
import useTerraAssets from '../hooks/useTerraAssets'
import { Contracts } from '../types'

const useContracts = (
  name: string
): {
  contracts?: Contracts
  data?: Dictionary<Contracts>
  loading: boolean
  error?: Error
} => {
  const response = useTerraAssets<Dictionary<Contracts>>(
    'cw20/contracts.json'
  )
  return { ...response, contracts: response.data?.[name] }
}

export default useContracts
