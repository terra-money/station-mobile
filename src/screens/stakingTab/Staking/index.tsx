import React, { ReactElement, useEffect, useState } from 'react'
import { useStaking, useAuth, User } from 'use-station/src'
import { StackScreenProps } from '@react-navigation/stack'

import { navigationHeaderOptions } from 'components/layout/TabScreenHeader'
import Body from 'components/layout/Body'

import ValidatorList from './ValidatorList'
import PersonalSummary from './PersonalSummary'

import { RootStackParams } from 'types'

type Props = StackScreenProps<RootStackParams, 'Staking'>

const Render = ({ user }: { user?: User }): ReactElement => {
  const { personal, ui, loading } = useStaking(user)
  return (
    <>
      {loading ? null : (
        <>
          {personal && user && (
            <PersonalSummary personal={personal} user={user} />
          )}
          {ui && <ValidatorList {...ui} />}
        </>
      )}
    </>
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
    <Body theme={'sky'} scrollable onRefresh={refreshPage}>
      {refreshing ? null : <Render user={user} />}
    </Body>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  title: 'Staking',
})

export default Screen
