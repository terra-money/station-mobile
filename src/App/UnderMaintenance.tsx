import React, { ReactElement, useState } from 'react'
import { View, StyleSheet, Animated, Easing } from 'react-native'

import { Button, Text } from 'components'
import { useCurrentChainName } from 'lib'
import useTerraAssets from 'lib/hooks/useTerraAssets'
import color from 'styles/color'
import Body from 'components/layout/Body'
import Maintenance from 'assets/svg/Maintenance'

const UnderMaintenance = (): ReactElement => {
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

  const [hideMaintenance, setHideMaintenance] = useState(false)
  const hide = (): void => setHideMaintenance(true)

  const currentChainName = useCurrentChainName()
  const { data: maintenance } = useTerraAssets<Dictionary<string>>(
    '/station/maintenance.json'
  )

  const isUnderMaintenance = maintenance?.[currentChainName]

  if (isUnderMaintenance && false === hideMaintenance) {
    return (
      <Body containerStyle={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={{ marginBottom: 5 }}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Maintenance
                color={color.primary._02}
                width="60"
                height="60"
              />
            </Animated.View>
          </View>
          <Text style={styles.title} fontType={'bold'}>
            Under Maintenance
          </Text>
          <Text>We will be back on Columbus-5 soon.</Text>
        </View>
        <View style={{ width: '100%' }}>
          <Button
            theme="sapphire"
            onPress={hide}
            title="Enter anyway"
            containerStyle={{ marginBottom: 40 }}
          />
        </View>
      </Body>
    )
  }
  return <View />
}

export default UnderMaintenance

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: 0,
    textAlign: 'center',
    paddingBottom: 5,
  },
})
