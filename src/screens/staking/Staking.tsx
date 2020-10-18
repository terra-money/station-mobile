import React from 'react'
import { useMenu, useStaking, useAuth } from '@terra-money/use-native-station'
import ValidatorList from './ValidatorList'
import Page from '../../components/Page'
import { StatusBar } from 'react-native'

const Staking = () => {
  const { user } = useAuth()
  const { Staking: title } = useMenu()
  const { ui, ...api } = useStaking(user)

  return (
    <Page {...api} title={title}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      {
        ui && 
        <ValidatorList {...ui} />
      }
    </Page>
  )
}

export default Staking
