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
import Preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'

type VisibleSmallType = 'show' | 'hide'

type Props = StackScreenProps<RootStackParams, 'Wallet'>

const Screen = (props: Props): ReactElement => {
  const { loading, data } = useSwapRate()
  const setSwapRate = useSetRecoilState(SwapRateStore.swapRate)
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [localHideSmall, setlocalHideSmall] = useState<boolean>()
  const [
    localHideSmallTokens,
    setlocalHideSmallTokens,
  ] = useState<boolean>()

  const [refreshingKey, setRefreshingKey] = useState(0)
  const refreshPage = async (): Promise<void> => {
    await getWalletSettings()
    setRefreshingKey((ori) => ori + 1)
  }

  const getWalletSettings = async (): Promise<void> => {
    const hideSmall = (await Preferences.getString(
      PreferencesEnum.walletHideSmall
    )) as VisibleSmallType
    const hideSmallTokens = (await Preferences.getString(
      PreferencesEnum.walletHideSmallTokens
    )) as VisibleSmallType

    setlocalHideSmall(
      hideSmall ? (hideSmall === 'hide' ? true : false) : undefined
    )
    setlocalHideSmallTokens(
      hideSmallTokens
        ? hideSmallTokens === 'hide'
          ? true
          : false
        : undefined
    )
  }

  const initPage = async (): Promise<void> => {
    await getWalletSettings()
  }

  useEffect(() => {
    if (false === loading && data) {
      setSwapRate(data)
    }
  }, [loading, data?.length])

  useEffect(() => {
    initPage().then((): void => {
      setLoadingComplete(true)
    })
  }, [])

  return (
    <WithAuth>
      {(user): ReactElement => (
        <>
          {loadingComplete && (
            <Body theme={'sky'} scrollable onRefresh={refreshPage}>
              <Fragment key={refreshingKey}>
                <WalletAddress user={user} />
                <AvailableAssets
                  {...{
                    user,
                    localHideSmall,
                    setlocalHideSmall,
                    localHideSmallTokens,
                  }}
                  {...props}
                />
                <History user={user} {...props} />
              </Fragment>
            </Body>
          )}
        </>
      )}
    </WithAuth>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  title: 'Wallet',
})

export default Screen
