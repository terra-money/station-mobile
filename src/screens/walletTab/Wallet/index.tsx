import React, {
  ReactElement,
  useEffect,
  useState,
  Fragment,
} from 'react'
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

const Screen = (props: Props): ReactElement => {
  const { loading, data } = useSwapRate()
  const setSwapRate = useSetRecoilState(SwapRateStore.swapRate)

  const [refreshingKey, setRefreshingKey] = useState(0)
  const refreshPage = async (): Promise<void> => {
    setRefreshingKey((ori) => ori + 1)
  }

  useEffect(() => {
    if (false === loading && data) {
      setSwapRate(data)
    }
  }, [loading, data?.length])

  return (
    <WithAuth>
      {(user): ReactElement => (
        <Body theme={'sky'} scrollable onRefresh={refreshPage}>
          <Fragment key={refreshingKey}>
            <WalletAddress user={user} />
            <AvailableAssets user={user} {...props} />
            <History user={user} {...props} />
          </Fragment>
        </Body>
      )}
    </WithAuth>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  title: 'Wallet',
})

export default Screen
