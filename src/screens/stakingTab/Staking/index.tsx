import React, { ReactElement } from 'react'
import { useStaking, useAuth } from 'use-station/src'

import { navigationHeaderOptions } from 'components/layout/TabScreenHeader'
import ValidatorList from './ValidatorList'
import Body from 'components/layout/Body'

const Screen = (): ReactElement => {
  const { user } = useAuth()
  const { ui } = useStaking(user)

  return <Body theme={'sky'}>{ui && <ValidatorList {...ui} />}</Body>
}

Screen.navigationOptions = navigationHeaderOptions({
  title: 'Staking',
})

export default Screen
