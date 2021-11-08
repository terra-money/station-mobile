import React, { useEffect, useState, ReactElement } from 'react'
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { COLOR } from 'consts'
import images from 'assets/images'
import { Text } from 'components'

interface Props {
  receivedBytes: number
  totalBytes: number
}

const Update = (props: Props): ReactElement => {
  const insets = useSafeAreaInsets()
  const [progress, setProgress] = useState(0)
  const receivedBytes = props.receivedBytes / 1024
  const totalBytes = props.totalBytes / 1024

  const formatReceivedBytes = (): string => {
    const recv =
      receivedBytes > 1024
        ? (receivedBytes / 1024).toFixed(2)
        : receivedBytes.toFixed(2)
    const recvUnit = receivedBytes > 1024 ? 'mb' : 'kb'

    const total =
      totalBytes > 1024 ? (totalBytes / 1024).toFixed(2) : totalBytes
    const totalUnit = totalBytes > 1024 ? 'mb' : 'kb'

    return `${recv} ${recvUnit} / ${total} ${totalUnit}`
  }

  const formatProgress = (): string => {
    return `${(progress * 100).toFixed(0)}%`
  }

  useEffect(() => {
    totalBytes > 0 && setProgress(receivedBytes / totalBytes)
  }, [receivedBytes])

  return (
    <View
      style={[
        { flex: 1, backgroundColor: COLOR.white },
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 120,
        },
      ]}
    >
      <SafeAreaView style={styles.container}>
        <Image
          source={images.loading_image}
          style={{ width: 160, height: 160 }}
        />
        <Text fontType="bold" style={styles.progressTitle}>
          Updating...
        </Text>
        <View style={styles.containerProgressText}>
          <Text fontType="book" style={styles.progressText}>
            {formatReceivedBytes()}
          </Text>
          <Text fontType="book" style={styles.progressText}>
            {formatProgress()}
          </Text>
        </View>
        <View style={styles.progress}>
          <View
            style={[
              styles.progressFill,
              {
                width:
                  (Dimensions.get('window').width - 40) * progress,
              },
            ]}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 20,
    lineHeight: 30,
    color: COLOR.primary._02,
    marginVertical: 5,
  },
  containerProgressText: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  progressText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLOR.primary._02,
  },
  progress: {
    alignSelf: 'stretch',
    height: 5,
    marginHorizontal: 20,
    backgroundColor: COLOR.gray,
    overflow: 'hidden',
  },
  progressFill: {
    alignSelf: 'stretch',
    height: '100%',
    backgroundColor: COLOR.primary._02,
  },
})

export default Update
