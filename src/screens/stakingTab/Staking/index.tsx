import React, { ReactElement, useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { RootStackParams } from 'types'
import {
  useStaking,
  useAuth,
  User,
  StakingPage,
} from 'use-station/src'

import { navigationHeaderOptions } from 'components/layout/TabScreenHeader'
import Body from 'components/layout/Body'

import ValidatorList from './ValidatorList'
import PersonalSummary from './PersonalSummary'

type Props = StackScreenProps<RootStackParams, 'Staking'>

const Render = ({
  user,
  navigation,
  personal,
  ui,
  execute,
}: { user?: User } & Props & StakingPage): ReactElement => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      execute()
    })
    return unsubscribe
  }, [])

  return (
    <>
      {!ui ? (
        <View
          style={{
            flex: 1,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <View>
          {personal && user && (
            <PersonalSummary personal={personal} user={user} />
          )}
          {ui && <ValidatorList {...ui} />}
        </View>
      )}
    </>
  )
}

const Screen = (props: Props): ReactElement => {
  const { user } = useAuth()
  const stakingProps = useStaking(user)
  const [refreshingKey, setRefreshingKey] = useState(0)
  const refreshPage = async (): Promise<void> => {
    setRefreshingKey((ori) => ori + 1)
  }

  const bodyProps = stakingProps.ui ? { scrollable: true } : {}

  return (
    <Body theme={'sky'} {...bodyProps} onRefresh={refreshPage}>
      <Render
        user={user}
        key={refreshingKey}
        {...props}
        {...stakingProps}
      />
    </Body>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  title: 'Staking',
})

export default Screen
