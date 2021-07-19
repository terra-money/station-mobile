import React, { ReactElement, useRef } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import _ from 'lodash'
import { BarCodeReadEvent } from 'react-native-camera'
import QRCodeScanner from 'react-native-qrcode-scanner'
import LocalFlashMessage from 'react-native-flash-message'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import TopNotification from 'components/TopNotification'

import Text from '../Text'
import Icon from '../Icon'
import NumberStep from '../NumberStep'
import color from 'styles/color'

const MARKER_FULL_WIDTH = 260
const MARKER_FULL_HEIGHT = 260
const FRAME_BORDER = 2
const FRAME_WIDTH = 20 + FRAME_BORDER
const FRAME_HEIGHT = 20
const MARKER_WIDTH = MARKER_FULL_WIDTH + FRAME_BORDER * 2

type QrScanType = {
  /**
   * @param {string} data if dataParser then return parsed data
   */
  onRead: (props: { data: string }) => void
  /**
   * @param {string} data data from scanner
   * @return {string} parsed data
   */
  dataParser?: (props: { data: string }) => string
  /**
   * If dataParser then check data from dataParser
   * @return {string} return error message
   */
  onlyIfScan?: (props: { data: string }) => string
  stepNo?: number
  closeModal: () => void
}

const QRScan = ({
  closeModal,
  onRead,
  stepNo,
  onlyIfScan,
  dataParser,
}: QrScanType): ReactElement => {
  const flashMessage = useRef<LocalFlashMessage>(null)
  const insets = useSafeAreaInsets()
  const onSuccess = ({ data }: BarCodeReadEvent): void => {
    const parsedData =
      (dataParser ? dataParser({ data }) : data) || ''

    if (onlyIfScan) {
      const errorMessage = onlyIfScan({ data: parsedData })
      if (errorMessage) {
        flashMessage.current?.showMessage({ message: errorMessage })
      } else {
        onRead({ data: parsedData })
        closeModal()
      }
    } else {
      onRead({ data: parsedData })
      closeModal()
    }
  }

  const hideMessage = (): void => {
    flashMessage.current?.hideMessage()
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

  const Header = (): ReactElement => (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: insets.top,
      }}
    >
      <TouchableOpacity
        style={style.backContainer}
        onPress={closeModal}
      >
        <Icon name={'close'} color={color.white} size={28} />
      </TouchableOpacity>
      {_.isNumber(stepNo) && (
        <NumberStep stepSize={2} nowStep={stepNo} />
      )}
    </View>
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
      reactivate
      reactivateTimeout={2500}
      onRead={onSuccess}
      cameraStyle={{ height: '100%' }}
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
          <Header />

          <LocalFlashMessage
            position="top"
            ref={flashMessage}
            MessageComponent={(props): ReactElement => {
              const options = {
                ...props,
                message: { ...props.message, type: 'danger' },
              }

              return (
                <TopNotification
                  {...options}
                  hideMessage={hideMessage}
                />
              )
            }}
          />
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
