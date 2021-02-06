import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { RootStackParams } from 'types'
import { useStaking, useAuth, User } from 'use-station/src'

import { navigationHeaderOptions } from 'components/layout/TabScreenHeader'
import Body from 'components/layout/Body'

import ValidatorList from './ValidatorList'
import PersonalSummary from './PersonalSummary'

type Props = StackScreenProps<RootStackParams, 'Staking'>

const Render = ({
  user,
  navigation,
}: { user?: User } & Props): ReactElement => {
  const { personal, ui, execute } = useStaking(user)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      execute()
    })
    return unsubscribe
  }, [])

  return (
    <View>
      {personal && user && (
        <PersonalSummary personal={personal} user={user} />
      )}
      {ui && <ValidatorList {...ui} />}
    </View>
  )
}

const Screen = (props: Props): ReactElement => {
  const { user } = useAuth()
  const [refreshingKey, setRefreshingKey] = useState(0)
  const refreshPage = async (): Promise<void> => {
    setRefreshingKey((ori) => ori + 1)
  }

  return (
    <Body theme={'sky'} scrollable onRefresh={refreshPage}>
      <Render user={user} key={refreshingKey} {...props} />
    </Body>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  title: 'Staking',
})

export default Screen
