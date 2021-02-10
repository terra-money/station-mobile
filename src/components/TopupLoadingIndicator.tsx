import React, { ReactElement } from 'react'
import { ActivityIndicator, View } from 'react-native'

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
    <ActivityIndicator size="large" color="#000" />
  </View>
)

export default TopupLoadingIndicator
