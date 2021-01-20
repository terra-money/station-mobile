import React, { ReactElement } from 'react'

import { navigationHeaderOptions } from 'components/layout/TabScreenHeader'
import Columns from './Columns'
import Charts from './Charts'
import Body from 'components/layout/Body'
import { View } from 'react-native'

const Screen = (): ReactElement => {
  return (
    <Body theme={'sky'} scrollable>
      <View style={{ height: 168 }}>
        <Columns />
      </View>
      <Charts />
    </Body>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  title: 'Dashboard',
})

export default Screen
