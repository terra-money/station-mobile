import { Dictionary } from 'ramda'
import useTerraAssets from '../hooks/useTerraAssets'

const useValidators = (): {
  data?: Dictionary<string>
  loading: boolean
  error: unknown
} => {
  return useTerraAssets<Dictionary<string>>('validators.json')
}

export default useValidators
