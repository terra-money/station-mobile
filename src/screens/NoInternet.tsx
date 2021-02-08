import React, { ReactElement, useEffect, useState } from 'react'
import { Icon, Text } from 'components'
import StatusBar from 'components/StatusBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import NetInfo, {
  NetInfoState,
} from '@react-native-community/netinfo'
import color from 'styles/color'
import layout from 'styles/layout'

const NoInternet = (): ReactElement => {
  const [isNetworkConnected, setNetworkConnected] = useState(true)
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(
      (state: NetInfoState) => setNetworkConnected(state.isConnected)
    )

    return (): void => unsubscribe()
  }, [])

  return (
    <>
      {!isNetworkConnected && (
        <SafeAreaView style={styles.container}>
          <StatusBar theme="white" />
          <Icon
            name="signal-wifi-off"
            color={color.sapphire}
            size={53}
            style={styles.icon}
          />
          <Text fontType="bold" style={styles.title}>
            {'No internet connection'}
          </Text>
          <Text fontType="book" style={styles.subTitle}>
            {'Please check your internet connection and retry again.'}
          </Text>
        </SafeAreaView>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: layout.getWindowWidth(),
    height: layout.getWindowHeight(),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  icon: { marginBottom: 9 },
  title: {
    fontSize: 24,
    color: color.sapphire,
    marginBottom: 5,
  },
  subTitle: { fontSize: 16, color: color.sapphire },
})

export default NoInternet
