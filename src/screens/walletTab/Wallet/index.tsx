import React, { ReactElement, useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { StackScreenProps } from '@react-navigation/stack'

import { RootStackParams } from 'types'
import { navigationHeaderOptions } from 'components/layout/TabScreenHeader'
import Body from 'components/layout/Body'
import WithAuth from 'components/layout/WithAuth'

import WalletAddress from './WalletAddress'
import AvailableAssets from './AvailableAssets'
import { useSwapRate } from 'hooks/useSwapRate'
import SwapRateStore from 'stores/SwapRateStore'
import History from './History'

type Props = StackScreenProps<RootStackParams, 'Wallet'>

const Screen = ({ navigation }: Props): ReactElement => {
  const { loading, data } = useSwapRate()
  const setSwapRate = useSetRecoilState(SwapRateStore.swapRate)

  const [refreshing, setRefreshing] = useState(false)
  const refreshPage = async (): Promise<void> => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 100)
  }

  useEffect(() => {
    if (false === loading && data) {
      setSwapRate(data)
    }
  }, [loading, data?.length])

  useEffect(() => {
    navigation.addListener('focus', () => {
      refreshPage()
    })
  }, [])

  return (
    <WithAuth>
      {(user): ReactElement => (
        <Body
          theme={'sky'}
          scrollable
          containerStyle={{ paddingTop: 20 }}
          onRefresh={refreshPage}
        >
          {refreshing ? null : (
            <>
              <WalletAddress user={user} />
              <AvailableAssets user={user} />
              <History user={user} />
            </>
          )}
        </Body>
      )}
    </WithAuth>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  title: 'Wallet',
})

export default Screen
