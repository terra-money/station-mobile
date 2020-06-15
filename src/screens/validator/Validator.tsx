import React from 'react'
import { Text } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import { useMenu, useAuth, useValidator } from '@terra-money/use-native-station'
import { ValidatorUI } from '@terra-money/use-native-station'
import { StakingRouteParams } from '../../types/navigation'
import Page from '../../components/Page'
import Header from './Header'
import Actions from './Actions'
import Informations from './Informations'
import Claims from './Claims'

type ValidatorRouteProp = RouteProp<StakingRouteParams, 'Validator'>

const Staking = () => {
  const { params } = useRoute<ValidatorRouteProp>()
  const { address } = params

  const { Validator: title } = useMenu()
  const { user } = useAuth()
  const { ui, delegations, ...api } = useValidator(address, user)

  const render = (ui: ValidatorUI, address: string) => (
    <>
      <Header {...ui} />
      <Actions {...ui} />
      <Informations {...ui} />

      <Text>{delegations}</Text>
      <Claims address={address} />
    </>
  )

  return (
    <Page {...api} title={title}>
      {ui && address && render(ui, address)}
    </Page>
  )
}

export default Staking
