import React, { ReactElement } from 'react'
// import { useInfo } from 'use-station/src'
import { View, Image } from 'react-native'
import images from 'assets/images'
// import Info from './Info'

const Loading = (): ReactElement => {
  // const { LOADING } = useInfo()
  return (
    <View style={{ alignItems: 'center' }}>
      <Image
        source={images.loading_circle}
        style={{ width: 30, height: 30, marginBottom: 20 }}
      />
    </View>
  )
  // return <Info {...LOADING} />
}

export default Loading
