import React, { ReactElement } from 'react'
import {
  useMenu,
  useStaking,
  useAuth,
} from '@terra-money/use-native-station'
import { StackNavigationOptions } from '@react-navigation/stack'
import { StatusBar } from 'react-native'
import ValidatorList from './ValidatorList'
import Page from '../../components/Page'

const Staking = (): ReactElement => {
  const { user } = useAuth()
  const { Staking: title } = useMenu()
  const { ui, ...api } = useStaking(user)

  return (
    <Page {...api} title={title}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      {ui && <ValidatorList {...ui} />}
    </Page>
  )
}

const navigationOptions = (): StackNavigationOptions => {
  return { headerShown: false }
}

Staking.navigationOptions = navigationOptions

export default Staking
