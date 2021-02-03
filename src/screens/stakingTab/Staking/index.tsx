import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'

import { useStaking, useAuth, User } from 'use-station/src'

import { navigationHeaderOptions } from 'components/layout/TabScreenHeader'
import Body from 'components/layout/Body'

import ValidatorList from './ValidatorList'
import PersonalSummary from './PersonalSummary'

import { RootStackParams } from 'types'

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

  return loading ? (
    <View />
  ) : (
    <View>
      {personal && user && (
        <PersonalSummary personal={personal} user={user} />
      )}
      {ui && <ValidatorList {...ui} />}
    </View>
  )
}

const Screen = ({ navigation }: Props): ReactElement => {
  const { user } = useAuth()
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [refreshingKey, setRefreshingKey] = useState(0)
  const refreshPage = async (): Promise<void> => {
    setRefreshingKey((ori) => ori + 1)
  }

  useEffect(() => {
    if (loadingComplete) {
      navigation.addListener('focus', () => {
        refreshPage()
      })
    }
  }, [loadingComplete])

  return (
    <Body theme={'sky'} scrollable onRefresh={refreshPage}>
      <Render
        user={user}
        key={refreshingKey}
        setLoadingComplete={setLoadingComplete}
      />
    </Body>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  title: 'Staking',
})

export default Screen
