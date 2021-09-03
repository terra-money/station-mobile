import { useQuery } from 'react-query'

import { useMemo } from 'react'
import { QueryKeyEnum } from 'types/reactQuery'
import _ from 'lodash'

import { useCurrentChainName, Whitelist } from 'lib'
import preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'
import { jsonTryParse } from 'utils/util'

const useTokens = (): {
  tokens: Whitelist
  addToken: (params: Whitelist) => void
  removeToken: (token: string) => void
} => {
  const chainName = useCurrentChainName()

  const { data: allNetworkTokens = {}, refetch } = useQuery(
    [QueryKeyEnum.tokens, chainName],
    async () => {
      const strData = await preferences.getString(
        PreferencesEnum.tokens
      )
      return jsonTryParse<Dictionary<Whitelist>>(strData || '{}')
    }
  )

  const addToken = (params: Whitelist): void => {
    const next = {
      ...allNetworkTokens,
      [chainName]: { ...allNetworkTokens[chainName], ...params },
    }
    preferences.setString(
      PreferencesEnum.tokens,
      JSON.stringify(next)
    )
    refetch()
  }

  const removeToken = (token: string): void => {
    const next = {
      ...allNetworkTokens,
      [chainName]: _.omit(allNetworkTokens[chainName], token),
    }
    preferences.setString(
      PreferencesEnum.tokens,
      JSON.stringify(next)
    )
    refetch()
  }

  const tokens = useMemo(() => allNetworkTokens[chainName] || {}, [
    allNetworkTokens,
  ])

  return {
    tokens,
    addToken,
    removeToken,
  }
}

export default useTokens
