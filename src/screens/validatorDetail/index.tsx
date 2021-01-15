import React, { ReactElement } from 'react'
import { Text } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import {
  useAuth,
  useValidator,
} from '@terra-money/use-native-station'
import { StackNavigationOptions } from '@react-navigation/stack'

import Header from 'components/layout/Header'

import { StakingRouteParams } from '../../types/navigation'

import Actions from './Actions'
import Informations from './Informations'
import Claims from './Claims'

type ValidatorRouteProp = RouteProp<
  StakingRouteParams,
  'ValidatorDetail'
>

const Staking = (): ReactElement => {
  const { params } = useRoute<ValidatorRouteProp>()
  const { address } = params

  const { user } = useAuth()
  const { ui, delegations } = useValidator(address, user)

  return (
    <>
      {ui && (
        <>
          <Actions {...ui} />
          <Informations {...ui} />
          <Text>{delegations}</Text>
          <Claims address={address} />
        </>
      )}
    </>
  )
}

const navigationOptions = (): StackNavigationOptions => {
  return {
    header: (): ReactElement => <Header />,
  }
}

Staking.navigationOptions = navigationOptions

export default Staking
