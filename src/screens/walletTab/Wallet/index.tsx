import React, { ReactElement, useEffect } from 'react'

import { navigationHeaderOptions } from 'components/layout/TabScreenHeader'
import Body from 'components/layout/Body'
import WithAuth from 'components/layout/WithAuth'

import WalletAddress from './WalletAddress'
import AvailableAssets from './AvailableAssets'
import { useSwapRate } from 'hooks/useSwapRate'
import { useSetRecoilState } from 'recoil'
import SwapRateStore from 'stores/SwapRateStore'
import { ScrollView } from 'react-native'

const Screen = (): ReactElement => {
  const { loading, data } = useSwapRate()
  const setSwapRate = useSetRecoilState(SwapRateStore.swapRate)
  useEffect(() => {
    if (false === loading && data) {
      setSwapRate(data)
    }
  }, [loading, data?.length])

  return (
    <WithAuth>
      {(user): ReactElement => (
        <Body theme={'sky'} containerStyle={{ paddingHorizontal: 0 }}>
          <ScrollView style={{ paddingHorizontal: 20 }}>
            <WalletAddress user={user} />
            <AvailableAssets user={user} />
          </ScrollView>
        </Body>
      )}
    </WithAuth>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  title: 'Wallet',
})

export default Screen
