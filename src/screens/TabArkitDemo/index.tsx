import React, { ReactElement, useState } from 'react'
import { StyleSheet } from 'react-native'
import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroARSceneNavigator,
} from '@viro-community/react-viro'

import { navigationHeaderOptions } from 'components/layout/Header'

const HelloWorldSceneAR = () => {
  const [text, setText] = useState('Initializing AR...')

  function onInitialized(state, reason) {
    console.log('guncelleme', state, reason)
    if (state === ViroConstants.TRACKING_NORMAL) {
      setText('Hello World!')
    } else if (state === ViroConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={styles.helloWorldTextStyle}
      />
    </ViroARScene>
  )
}

export const ArkitDemo = (): ReactElement => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={styles.f1}
    />
  )
}

ArkitDemo.navigationOptions = navigationHeaderOptions({
  title: 'Arkit Demo',
})

var styles = StyleSheet.create({
  f1: { flex: 1 },
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
})
