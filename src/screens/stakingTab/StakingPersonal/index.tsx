import React, { ReactElement, useEffect, useState } from 'react'
import {
  useStaking,
  useAuth,
  User,
  ValidatorUI,
} from 'use-station/src'
import { StackScreenProps } from '@react-navigation/stack'

import { navigationHeaderOptions } from 'components/layout/Header'
import Body from 'components/layout/Body'
import { View } from 'react-native'

import { RootStackParams } from 'types'

import Rewards from './Rewards'
import Delegated from './Delegated'
import UnDelegated from './UnDelegated'

type Props = StackScreenProps<RootStackParams, 'Staking'>

const Render = ({ user }: { user?: User }): ReactElement => {
  const { personal, ui } = useStaking(user)

  const findMoniker = ({
    name,
  }: {
    name: string
  }): ValidatorUI | undefined =>
    ui?.contents.find((x) => x.moniker === name)

  return personal ? (
    <>
      <Rewards personal={personal} />
      <Delegated personal={personal} findMoniker={findMoniker} />
      <UnDelegated personal={personal} findMoniker={findMoniker} />
    </>
  ) : (
    <View />
  )
}

const Screen = ({ navigation }: Props): ReactElement => {
  const { user } = useAuth()

  const [refreshing, setRefreshing] = useState(false)
  const refreshPage = async (): Promise<void> => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 100)
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      refreshPage()
    })
  }, [])

  return (
    <Body
      theme={'sky'}
      containerStyle={{ paddingTop: 20 }}
      scrollable
      onRefresh={refreshPage}
    >
      {refreshing ? null : <Render user={user} />}
    </Body>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  theme: 'white',
})

export default Screen
