import React, { ReactElement } from 'react'
import { useAuth, useValidator } from 'use-station/src'
import { StackScreenProps } from '@react-navigation/stack'

import { navigationHeaderOptions } from 'components/layout/Header'
import Body from 'components/layout/Body'

import { RootStackParams } from '../../../types/navigation'

import Top from './Top'
import Actions from './Actions'
import MonikerInfo from './MonikerInfo'
import Informations from './Informations'

type Props = StackScreenProps<RootStackParams, 'ValidatorDetail'>

const Screen = ({ route }: Props): ReactElement => {
  const { address } = route.params

  const { user } = useAuth()
  const { ui } = useValidator(address, user)

  return (
    <>
      {ui && (
        <Body scrollable containerStyle={{ paddingHorizontal: 0 }}>
          <Top ui={ui} />
          <Actions {...ui} />
          <MonikerInfo ui={ui} />
          <Informations {...ui} />
        </Body>
      )}
    </>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  theme: 'white',
})

export default Screen
