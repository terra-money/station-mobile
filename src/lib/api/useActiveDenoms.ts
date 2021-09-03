import { API, OracleData } from '../types'
import useFCD from './useFCD'

export default (): API<OracleData> => {
  const response = useFCD<OracleData>({
    url: '/oracle/denoms/actives',
  })
  return response
}
