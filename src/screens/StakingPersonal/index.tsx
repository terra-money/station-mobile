import React, { ReactElement, useEffect, useState } from 'react'
import { useStaking, useAuth, User, ValidatorUI } from 'lib'
import { StackScreenProps } from '@react-navigation/stack'

import { navigationHeaderOptions } from 'components/layout/Header'
import Body from 'components/layout/Body'
import { View } from 'react-native'

import { RootStackParams } from 'types'

import Rewards from './Rewards'
import Delegated from './Delegated'
import UnDelegated from './UnDelegated'
import { Text } from 'components'

type Props = StackScreenProps<RootStackParams, 'Staking'>

const Render = ({
  user,
  setLoadingComplete,
}: {
  user?: User
  setLoadingComplete: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement => {
  const { personal, ui, loading } = useStaking(user)

  useEffect(() => {
    if (loading === false) {
      setLoadingComplete(true)
    }
  }, [loading])

  const findMoniker = ({
    name,
  }: {
    name: string
  }): ValidatorUI | undefined =>
    ui?.contents.find((x) => x.moniker === name)

  return personal ? (
    <>
      {user && <Rewards personal={personal} user={user} />}
      <Delegated personal={personal} findMoniker={findMoniker} />
      <UnDelegated personal={personal} findMoniker={findMoniker} />
    </>
  ) : (
    <View />
  )
}

const StakingPersonal = ({ navigation }: Props): ReactElement => {
  const { user } = useAuth()
  const [loadingComplete, setLoadingComplete] = useState(false)

  const [refreshingKey, setRefreshingKey] = useState(0)
  const refreshPage = async (): Promise<void> => {
    setRefreshingKey((ori) => ori + 1)
  }

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
      scrollable
      onRefresh={refreshPage}
    >
      <Render
        key={refreshingKey}
        user={user}
        setLoadingComplete={setLoadingComplete}
      />
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
