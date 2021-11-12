import React, { ReactElement } from 'react'
import { View, Image, StyleProp, ViewStyle } from 'react-native'
import images from 'assets/images'

const Loading = (props: {
  size?: number
  style?: StyleProp<ViewStyle>
}): ReactElement => {
  const size = props.size || 38
  return (
    <View
      style={[
        { alignItems: 'center', marginBottom: 20 },
        props.style,
      ]}
    >
      <Image
        source={images.loading_circle}
        style={{ width: size, height: size }}
      />
    </View>
  )
}

export default Loading
