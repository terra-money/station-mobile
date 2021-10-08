import React, { ReactElement } from 'react'
import { View, Image } from 'react-native'
import images from 'assets/images'

const Loading = (): ReactElement => {
  return (
    <View style={{ alignItems: 'center' }}>
      <Image
        source={images.loading_circle}
        style={{ width: 38, height: 38, marginBottom: 20 }}
      />
    </View>
  )
}

export default Loading
