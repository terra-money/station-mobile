import { Icon } from 'components'
import React, { ReactElement } from 'react'
import {
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { Text } from 'components'
import { BarCodeReadEvent } from 'react-native-camera'
import QRCodeScanner from 'react-native-qrcode-scanner'
import color from 'styles/color'

const MARKER_FULL_WIDTH = 260
const MARKER_FULL_HEIGHT = 260
const FRAME_BORDER = 2
const FRAME_WIDTH = 20 + FRAME_BORDER
const FRAME_HEIGHT = 20
const MARKER_WIDTH = MARKER_FULL_WIDTH + FRAME_BORDER * 2

type QrScanType = {
  onRead: (event: BarCodeReadEvent) => void
} & AppModal

const QRScan = ({ close, onRead }: QrScanType): ReactElement => {
  const onSuccess = (e: BarCodeReadEvent): void => {
    onRead(e)
    close()
  }

  const Vertical = (): ReactElement => (
    <View style={style.verticalFrameContainer}>
      <View style={style.verticalFrameSubContainer}>
        <View style={style.verticalFrame} />
        <View style={style.verticalFrame} />
      </View>
    </View>
  )

  const Horizontal = (): ReactElement => (
    <View style={style.horizontalFrameContainer}>
      <View style={style.horizontalFrame} />
      <View style={style.horizontalFrame} />
    </View>
  )

  const Back = (): ReactElement => (
    <TouchableOpacity style={style.backContainer} onPress={close}>
      <Icon name={'close'} color={color.white} size={28} />
    </TouchableOpacity>
  )

  const Title = (): ReactElement => (
    <View style={style.titleContainer}>
      <Text fontType="medium" style={style.titleText}>
        {'Scan QR code'}
      </Text>
    </View>
  )

  return (
    <QRCodeScanner
      onRead={onSuccess}
      cameraStyle={{ height: Dimensions.get('window').height }}
      showMarker
      customMarker={
        <View style={style.container}>
          <View style={style.verticalContainer} />

          <Vertical />

          <View style={style.markerContainer}>
            <View
              style={[
                style.horizontalContainer,
                { justifyContent: 'flex-end' },
              ]}
            >
              <Horizontal />
            </View>

            <View style={{ alignItems: 'center' }}>
              <View style={style.marker} />
            </View>

            <View
              style={[
                style.horizontalContainer,
                { justifyContent: 'flex-start' },
              ]}
            >
              <Horizontal />
            </View>
          </View>

          <Vertical />
          <Title />

          <View style={style.verticalContainer} />
          <Back />
        </View>
      }
    />
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },

  verticalContainer: { flex: 1, backgroundColor: color.qrBackground },
  horizontalContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    backgroundColor: color.qrBackground,
  },

  markerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  marker: {
    width: MARKER_FULL_WIDTH,
    height: MARKER_FULL_HEIGHT,
    backgroundColor: 'transparent',
  },

  backContainer: {
    position: 'absolute',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  titleContainer: { backgroundColor: color.qrBackground },
  titleText: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    color: color.white,
    alignSelf: 'center',
  },
  horizontalFrameContainer: {
    width: FRAME_BORDER,
    justifyContent: 'space-between',
  },
  horizontalFrame: {
    width: FRAME_BORDER,
    height: FRAME_HEIGHT,
    backgroundColor: '#fff',
  },

  verticalFrameContainer: {
    width: '100%',
    height: FRAME_BORDER,
    backgroundColor: color.qrBackground,
    alignSelf: 'center',
  },
  verticalFrameSubContainer: {
    flexDirection: 'row',
    width: MARKER_WIDTH,
    height: FRAME_BORDER,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  verticalFrame: {
    width: FRAME_WIDTH,
    height: FRAME_BORDER,
    backgroundColor: '#fff',
  },
})

export default QRScan
