import React, {
  ReactElement,
  useEffect,
  useState,
  Fragment,
} from 'react'
import { StackScreenProps } from '@react-navigation/stack'

import { RootStackParams } from 'types'
import { navigationHeaderOptions } from 'components/layout/TabScreenHeader'
import Body from 'components/layout/Body'
import WithAuth from 'components/layout/WithAuth'

import WalletAddress from './WalletAddress'
import AvailableAssets from './AvailableAssets'
import History from './History'
import Preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'

type VisibleSmallType = 'show' | 'hide'

type Props = StackScreenProps<RootStackParams, 'Wallet'>

const Wallet = (props: Props): ReactElement => {
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [localHideSmall, setlocalHideSmall] = useState<boolean>()

  const [refreshingKey, setRefreshingKey] = useState(0)
  const refreshPage = async (): Promise<void> => {
    await getWalletSettings()
    setRefreshingKey((ori) => ori + 1)
  }

  const getWalletSettings = async (): Promise<void> => {
    const hideSmall = (await Preferences.getString(
      PreferencesEnum.walletHideSmall
    )) as VisibleSmallType

    setlocalHideSmall(
      hideSmall ? (hideSmall === 'hide' ? true : false) : undefined
    )
  }

  const initPage = async (): Promise<void> => {
    await getWalletSettings()
  }

  useEffect(() => {
    initPage().then((): void => {
      setLoadingComplete(true)
    })
    const unsubscribe = props.navigation.addListener('focus', () => {
      refreshPage()
    })

    return (): void => {
      unsubscribe()
    }
  }, [])

  return (
    <WithAuth>
      {(user): ReactElement => (
        <>
          {loadingComplete && (
            <Body theme={'sky'} scrollable onRefresh={refreshPage}>
              <Fragment>
                <WalletAddress user={user} />
                <AvailableAssets
                  {...{
                    user,
                    localHideSmall,
                    setlocalHideSmall,
                    refreshingKey,
                  }}
                  {...props}
                />
                <History
                  key={refreshingKey}
                  {...{ user }}
                  {...props}
                />
              </Fragment>
            </Body>
          )}
        </>
      )}
    </WithAuth>
  )
}

Wallet.navigationOptions = navigationHeaderOptions({
  title: 'Wallet',
})

export default Wallet
