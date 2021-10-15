import React, { ReactElement } from 'react'
import { View, Image, StyleProp, ViewStyle } from 'react-native'
import images from 'assets/images'

const Loading = (props: {
  size?: number
  style?: StyleProp<ViewStyle>
}): ReactElement => {
  const size = props.size || 38
  return (
    <View style={[{ alignItems: 'center' }, props.style]}>
      <Image
        source={images.loading_circle}
        style={{ width: size, height: size, marginBottom: 20 }}
      />
    </View>
  )
}

export default Loading
