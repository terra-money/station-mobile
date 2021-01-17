import React, { ReactElement } from 'react'
import { ScrollView } from 'react-native'

import { navigationHeaderOptions } from 'components/layout/TabScreenHeader'
import Columns from './Columns'
import Charts from './Charts'
import Body from 'components/layout/Body'

const Screen = (): ReactElement => {
  return (
    <Body theme={'sky'}>
      <ScrollView>
        <Columns />
        <Charts />
      </ScrollView>
    </Body>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  title: 'Dashboard',
})

export default Screen
