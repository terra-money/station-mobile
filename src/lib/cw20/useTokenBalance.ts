import { useQuery } from 'react-query'
import _ from 'lodash'
import { TokenBalance, Tokens } from '../types'
import { QueryKeyEnum } from 'types'
import { useConfig } from '../contexts/ConfigContext'
import useTokens from 'hooks/useTokens'

export interface TokenBalanceQuery {
  isLoading: boolean
  tokens?: Tokens
  list?: TokenBalance[]
  refetch: () => void
}

import useLCD from 'lib/api/useLCD'

export default (address: string): TokenBalanceQuery => {
  const { tokens } = useTokens()
  const { chain } = useConfig()
  const lcd = useLCD()

  const { data: list = [], isLoading, refetch } = useQuery(
    [
      QueryKeyEnum.tokenBalances,
      address,
      chain.current.mantle,
      tokens,
    ],
    async () => {
      if (_.some(tokens)) {
        const data = []
        for (const token in tokens) {
          try {
            const { balance } = await lcd.wasm.contractQuery<{ balance: Amount }>(token, { balance: { address } })
            data.push({ ...tokens[token], balance })
          } catch(e) {
            data.push({ ...tokens[token], balance: '0' })
          }
        }
        return data
      }
      return []
    }
  )

  return {
    refetch,
    isLoading,
    tokens,
    list,
  }
}
