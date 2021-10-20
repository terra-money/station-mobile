import React, { ReactElement, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import NetInfo, {
  NetInfoState,
} from '@react-native-community/netinfo'

import { COLOR, LAYOUT } from 'consts'
import { Icon, Text, StatusBar } from 'components'

const NoInternet = (): ReactElement => {
  const [isNetworkUnavailable, setNetworkUnavailable] = useState(
    false
  )
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(
      (state: NetInfoState) => {
        setNetworkUnavailable(
          state.isConnected === false ||
            state.isInternetReachable === false
        )
      }
    )

    return (): void => unsubscribe()
  }, [])

  return (
    <>
      {false && isNetworkUnavailable && (
        <SafeAreaView style={styles.container}>
          <StatusBar theme="white" />
          <Icon
            name="signal-wifi-off"
            color={COLOR.primary._02}
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
    width: LAYOUT.getWindowWidth(),
    height: LAYOUT.getWindowHeight(),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLOR.sky,
  },
  icon: { marginBottom: 15 },
  title: {
    fontSize: 24,
    color: COLOR.primary._02,
    marginBottom: 5,
    lineHeight: 36,
  },
  subTitle: {
    fontSize: 16,
    color: COLOR.primary._02,
    lineHeight: 24,
    textAlign: 'center',
  },
})

export default NoInternet
