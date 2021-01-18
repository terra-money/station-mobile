import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { navigationHeaderOptions } from 'components/layout/TabScreenHeader'
import Body from 'components/layout/Body'
import Text from 'components/Text'

const Screen = (): ReactElement => {
  return (
    <Body theme={'sky'}>
      <View>
        <Text>wallet</Text>
      </View>
    </Body>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  title: 'Wallet',
})

export default Screen
