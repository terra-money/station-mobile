import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Loading } from 'components'

const TopupLoadingIndicator = (): ReactElement => (
  <View
    style={{
      position: 'absolute',
      flex: 1,
      width: '100%',
      height: '100%',
      alignContent: 'center',
      justifyContent: 'center',
    }}
  >
    <Loading />
  </View>
)

export default TopupLoadingIndicator
