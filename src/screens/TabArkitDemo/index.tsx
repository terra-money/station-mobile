import React, { ReactElement, useState } from 'react'
import { StyleSheet } from 'react-native'
import {
  ViroARScene,
  ViroImage,
  ViroQuad,
  ViroNode,
  ViroMaterials,
  ViroOmniLight,
  ViroARTrackingTargets,
  ViroARImageMarker,
  ViroAnimations,
  Viro3DObject,
  ViroSpotLight,
  ViroAmbientLight,
  ViroARSceneNavigator,
  ViroParticleEmitter,
  ViroSphere,
} from '@viro-community/react-viro'

import { navigationHeaderOptions } from 'components/layout/Header'

import bpantherAnim from 'assets/res/blackpanther/object_bpanther_anim.vrx'
import bpantherBaseColor from 'assets/res/blackpanther/object_bpanther_Base_Color.png'
import blackPanterJpg from 'assets/res/blackpanther.jpg'

const HelloWorldSceneAR = (): ReactElement => {
  const [text, setText] = useState('Initializing AR...')
  const [state, setState] = useState({
    loopState: false,
    animationName: '01',
    pauseUpdates: false,
    playAnim: false,
    modelAnim: false,
  })

  const onInitialized = (state: any, reason: any) => {
    // console.log('guncelleme', state, reason)
    if (state === ViroConstants.TRACKING_NORMAL) {
      setText('Hello World!')
    } else if (state === ViroConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }

  const _onFinish = () => {
    setState({
      animationName: '02',
      loopState: true,
    })
  }

  const _onAnchorFound = () => {
    setState({
      pauseUpdates: true,
      playAnim: true,
      modelAnim: true,
    })
  }

  const _onModelLoad = () => {
    setTimeout(() => {
      setState({})
    }, 3000)
  }

  // return (
  //   <ViroARScene onTrackingUpdated={onInitialized}>
  //     <ViroText
  //       text={text}
  //       scale={[0.5, 0.5, 0.5]}
  //       position={[0, 0, -1]}
  //       style={styles.helloWorldTextStyle}
  //     />
  //   </ViroARScene>
  // )
  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={200} />

      <ViroARImageMarker
        target={'poster'}
        onAnchorFound={_onAnchorFound}
        pauseUpdates={state.pauseUpdates}
      >
        <ViroNode
          position={[0, -0.1, 0]}
          scale={[0, 0, 0]}
          rotation={[-90, 0, 0]}
          dragType="FixedToWorld"
          onDrag={() => {}}
          animation={{ name: 'scaleModel', run: state.playAnim }}
        >
          <Viro3DObject
            onLoadEnd={_onModelLoad}
            source={bpantherAnim}
            resources={[
              bpantherBaseColor,
              // require('assets/res/blackpanther/object_bpanther_Base_Color.png'),
              // require('assets/res/blackpanther/object_bpanther_Metallic.png'),
              // require('assets/res/blackpanther/object_bpanther_Mixed_AO.png'),
              // require('assets/res/blackpanther/object_bpanther_Normal_OpenGL.png'),
              // require('assets/res/blackpanther/object_bpanther_Roughness.png'),
            ]}
            position={[0, -1.45, 0]}
            scale={[0.9, 0.9, 0.9]}
            animation={{
              name: state.animationName,
              run: state.modelAnim,
              loop: state.loopState,
              onFinish: _onFinish,
            }}
            type="VRX"
          />
        </ViroNode>
      </ViroARImageMarker>

      <ViroOmniLight
        intensity={300}
        position={[-10, 10, 1]}
        color={'#FFFFFF'}
        attenuationStartDistance={20}
        attenuationEndDistance={30}
      />

      <ViroOmniLight
        intensity={300}
        position={[10, 10, 1]}
        color={'#FFFFFF'}
        attenuationStartDistance={20}
        attenuationEndDistance={30}
      />

      <ViroOmniLight
        intensity={300}
        position={[-10, -10, 1]}
        color={'#FFFFFF'}
        attenuationStartDistance={20}
        attenuationEndDistance={30}
      />

      <ViroOmniLight
        intensity={300}
        position={[10, -10, 1]}
        color={'#FFFFFF'}
        attenuationStartDistance={20}
        attenuationEndDistance={30}
      />

      <ViroSpotLight
        position={[0, 8, -2]}
        color="#ffffff"
        direction={[0, -1, 0]}
        intensity={50}
        attenuationStartDistance={5}
        attenuationEndDistance={10}
        innerAngle={5}
        outerAngle={20}
        castsShadow={true}
      />

      <ViroQuad
        rotation={[-90, 0, 0]}
        position={[0, -1.6, 0]}
        width={5}
        height={5}
        arShadowReceiver={true}
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

ViroARTrackingTargets.createTargets({
  poster: {
    source: blackPanterJpg,
    orientation: 'Up',
    physicalWidth: 0.6096, // real world width in meters
  },
})

ViroAnimations.registerAnimations({
  scaleModel: {
    properties: { scaleX: 1, scaleY: 1, scaleZ: 1 },
    duration: 1000,
  },
})
