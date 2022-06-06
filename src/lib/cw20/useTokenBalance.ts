import { useQuery } from 'react-query'
import _ from 'lodash'
import { TokenBalance, Tokens } from '../types'
import { QueryKeyEnum } from 'types'
import { useConfig } from '../contexts/ConfigContext'
import useTokens from 'hooks/useTokens'
import useLCD from 'lib/api/useLCD'
import useWhitelist from 'lib/cw20/useWhitelist'

export interface TokenBalanceQuery {
  isLoading: boolean
  tokens?: Tokens
  list?: TokenBalance[]
  refetch: () => void
}

export default (address: string): TokenBalanceQuery => {
  const { whitelist } = useWhitelist()
  const { tokens, removeToken } = useTokens()
  const { chain } = useConfig()
  const lcd = useLCD()

  const { data: list = [], isLoading, refetch } = useQuery(
    [
      QueryKeyEnum.tokenBalances,
      address,
      chain.current.mantle,
      tokens,
      whitelist,
    ],
    async () => {
      if (_.some(tokens)) {
        const data = []
        for (const token in tokens) {
          try {
            if (whitelist?.hasOwnProperty(token)) {
              const { balance } = await lcd.wasm.contractQuery<{ balance: Amount }>(token, { balance: { address } })
              data.push({ ...tokens[token], balance })
            }
          } catch {
            if (!whitelist?.hasOwnProperty(token)) {
              removeToken(token)
            }
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
