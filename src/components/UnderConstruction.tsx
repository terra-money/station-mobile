import React, { ReactElement } from 'react'
import { View, Animated, StyleSheet, Easing } from "react-native";
import Maintenance from "assets/svg/Maintenance";
import { COLOR } from "consts";
import { Text } from "./index";

const UnderConstruction = (): ReactElement => {
  const spinValue = new Animated.Value(0)

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
    { iterations: 5000 }
  ).start()

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <View
      style={[{
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }]}
    >
      <View style={{ marginBottom: 5, alignItems: 'center' }}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Maintenance
            color={COLOR.primary._02}
            width="60"
            height="60"
          />
        </Animated.View>
      </View>
      <Text style={styles.title} fontType={'bold'}>
        Under Maintenance
      </Text>
      <Text>We will be back soon.</Text>
    </View>
  )
}

export default UnderConstruction

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: 0,
    textAlign: 'center',
    paddingBottom: 5,
  },
})
