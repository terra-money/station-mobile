import { Dictionary } from 'ramda'
import useTerraAssets from '../hooks/useTerraAssets'

const useValidators = (): {
  data: Dictionary<string> | undefined
  loading: boolean
  error: Error | undefined
} => {
  return useTerraAssets<Dictionary<string>>('validators.json')
}

export default useValidators
