import React, { ReactElement } from 'react'
import { Image, View, StyleSheet } from 'react-native'

import { Text } from 'components'
import images from 'assets/images'
import { useRecoilValue } from 'recoil'
import AppStore from 'stores/AppStore'

export const LoadingView = (): ReactElement => {
  const showLoading = useRecoilValue(AppStore.showLoading)
  return showLoading ? (
    <View style={styles.container}>
      <Image
        source={images.loading_image}
        style={{ width: 160, height: 160, marginBottom: 5 }}
      />
      <Text style={styles.title} fontType={'bold'}>
        Broadcasting transaction
      </Text>
      <Text style={styles.desc}>
        Please wait while your transaction is being processed.
      </Text>
    </View>
  ) : (
    <View />
  )
}

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
  },
  desc: {
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
  },
})
