import React, { ReactElement } from 'react'
import { useRoute, RouteProp } from '@react-navigation/native'
import { useAuth, useValidator } from 'use-station/src'

import { navigationHeaderOptions } from 'components/layout/Header'
import { Text } from 'components'

import { StakingRouteParams } from '../../../types/navigation'

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

Staking.navigationOptions = navigationHeaderOptions({})

export default Staking
