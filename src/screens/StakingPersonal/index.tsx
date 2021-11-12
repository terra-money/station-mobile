import React, { ReactElement, useEffect, useState } from 'react'
import {
  useStaking,
  useAuth,
  User,
  ValidatorUI,
  StakingPersonal as StationStakingPersonal,
  StakingUI,
} from 'lib'
import { StackScreenProps } from '@react-navigation/stack'

import { navigationHeaderOptions } from 'components/layout/Header'
import Body from 'components/layout/Body'

import { RootStackParams } from 'types'

import Rewards from './Rewards'
import Delegated from './Delegated'
import UnDelegated from './UnDelegated'
import { Loading, Text } from 'components'

type Props = StackScreenProps<RootStackParams, 'Staking'>

const Render = ({
  user,
  personal,
  ui,
}: {
  user?: User
  personal: StationStakingPersonal
  ui?: StakingUI
}): ReactElement => {
  const findMoniker = ({
    name,
  }: {
    name: string
  }): ValidatorUI | undefined =>
    ui?.contents.find((x) => x.moniker === name)

  return (
    <>
      {user && <Rewards personal={personal} user={user} />}
      <Delegated personal={personal} findMoniker={findMoniker} />
      <UnDelegated personal={personal} findMoniker={findMoniker} />
    </>
  )
}

const StakingPersonal = ({ navigation }: Props): ReactElement => {
  const { user } = useAuth()
  const { personal, ui, loading } = useStaking(user)
  const [loadingComplete, setLoadingComplete] = useState(false)

  const [refreshingKey, setRefreshingKey] = useState(0)
  const refreshPage = async (): Promise<void> => {
    setRefreshingKey((ori) => ori + 1)
  }

  useEffect(() => {
    if (loading === false) {
      setLoadingComplete(true)
    }
  }, [loading])

  useEffect(() => {
    let unsubscribe
    if (loadingComplete) {
      unsubscribe = navigation.addListener('focus', () => {
        refreshPage()
      })
    }
    return unsubscribe
  }, [loadingComplete])

  return (
    <Body
      theme={'sky'}
      containerStyle={{ paddingTop: 20 }}
      scrollable={loadingComplete}
      onRefresh={refreshPage}
    >
      {loadingComplete ? (
        personal && (
          <Render
            user={user}
            personal={personal}
            ui={ui}
            key={refreshingKey}
          />
        )
      ) : (
        <Loading
          style={{
            flex: 1,
            height: '100%',
            justifyContent: 'center',
          }}
        />
      )}
    </Body>
  )
}

StakingPersonal.navigationOptions = navigationHeaderOptions({
  theme: 'white',
  headerTitle: (): ReactElement => (
    <Text
      style={{ fontSize: 16, lineHeight: 24, letterSpacing: 0 }}
      fontType="bold"
    >
      {'Staking details'}
    </Text>
  ),
})

export default StakingPersonal
