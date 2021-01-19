import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { navigationHeaderOptions } from 'components/layout/TabScreenHeader'
import Body from 'components/layout/Body'
import WithAuth from 'components/layout/WithAuth'
import Text from 'components/Text'

const Screen = (): ReactElement => {
  return (
    <WithAuth>
      {(): ReactElement => (
        <Body theme={'sky'}>
          <View>
            <Text>swap</Text>
          </View>
        </Body>
      )}
    </WithAuth>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  title: 'Spaw',
})

export default Screen
