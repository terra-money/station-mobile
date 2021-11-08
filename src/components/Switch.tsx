import React, { ReactElement, useEffect, useState } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

import { COLOR } from 'consts'

const SWITCH_WIDTH = 52
const SWITCH_HEIGHT = 32
const Switch = ({ value }: { value: boolean }): ReactElement => {
  const [aniVal] = useState(new Animated.Value(0))
  const posX = aniVal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SWITCH_WIDTH - SWITCH_HEIGHT],
  })

  useEffect(() => {
    if (value) {
      Animated.timing(aniVal, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(aniVal, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start()
    }
  }, [value])

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: value ? COLOR.primary._03 : '#eee',
        },
      ]}
    >
      <Animated.View
        style={[
          styles.btn,
          {
            marginLeft: posX,
            borderColor: value ? COLOR.primary._03 : '#eee',
          },
        ]}
      />
    </View>
  )
}

export default Switch

const styles = StyleSheet.create({
  container: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: SWITCH_HEIGHT / 2,
  },
  btn: {
    width: SWITCH_HEIGHT,
    height: SWITCH_HEIGHT,
    borderRadius: 100,
    backgroundColor: 'white',
    borderWidth: 2,
  },
})
