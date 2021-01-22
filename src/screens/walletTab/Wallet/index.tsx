import React, { ReactElement, useEffect } from 'react'
import { useSetRecoilState } from 'recoil'

import { navigationHeaderOptions } from 'components/layout/TabScreenHeader'
import Body from 'components/layout/Body'
import WithAuth from 'components/layout/WithAuth'

import WalletAddress from './WalletAddress'
import AvailableAssets from './AvailableAssets'
import { useSwapRate } from 'hooks/useSwapRate'
import SwapRateStore from 'stores/SwapRateStore'
import History from './History'

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
        <Body
          theme={'sky'}
          scrollable
          containerStyle={{ paddingTop: 20 }}
        >
          <WalletAddress user={user} />
          <AvailableAssets user={user} />
          <History user={user} />
        </Body>
      )}
    </WithAuth>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  title: 'Wallet',
})

export default Screen
