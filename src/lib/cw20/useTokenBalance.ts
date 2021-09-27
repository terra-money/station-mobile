import { useQuery } from 'react-query'
import _ from 'lodash'

import { ApolloClient, InMemoryCache } from '@apollo/client'
import { TokenBalance, Tokens } from '../types'
import { QueryKeyEnum } from 'types'
import { useConfig } from '../contexts/ConfigContext'
import alias from './alias'
import useTokens from 'hooks/useTokens'
import { jsonTryParse } from 'utils/util'

export interface TokenBalanceQuery {
  isLoading: boolean
  tokens?: Tokens
  list?: TokenBalance[]
  refetch: () => void
}

export default (address: string): TokenBalanceQuery => {
  const { tokens } = useTokens()
  const { chain } = useConfig()

  const { data: list = [], isLoading, refetch } = useQuery(
    [
      QueryKeyEnum.tokenBalances,
      address,
      chain.current.mantle,
      tokens,
    ],
    async () => {
      if (_.some(tokens)) {
        try {
          const client = new ApolloClient({
            uri: chain.current.mantle,
            cache: new InMemoryCache(),
          })

          const queries = alias(
            Object.values(tokens).map(({ token }) => ({
              token,
              contract: token,
              msg: { balance: { address } },
            }))
          )

          const { data } = await client.query({
            query: queries,
            errorPolicy: 'all',
          })

          return _.reduce<any, TokenBalance[]>(
            data,
            (res, curr, key) => {
              if (curr?.Result) {
                const balance =
                  jsonTryParse<{ balance: string }>(curr.Result)
                    ?.balance || '0'
                res.push({ ...tokens[key], balance })
              }
              return res
            },
            []
          )
        } catch {}
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
