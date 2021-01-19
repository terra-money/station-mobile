import React, { ReactElement } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { VestingItemUI } from 'use-station/src'

const AssetItem = ({
  item: { display },
}: {
  item: VestingItemUI
}): ReactElement => {
  return (
    <View style={styles.container}>
      <Text>{display.value}</Text>
      <Text>{display.unit}</Text>
    </View>
  )
}

export default AssetItem

const styles = StyleSheet.create({
  container: {
    width: 335,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 35,
    shadowOpacity: 1,
  },
})
