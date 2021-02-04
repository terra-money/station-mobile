import React, { ReactElement, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { useNavigation } from '@react-navigation/native'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import { Button, Text, Icon } from 'components'

import RecoverWalletStore from 'stores/RecoverWalletStore'
import color from 'styles/color'
import { useQRScan } from 'hooks/useQrScan'
import { useAlert } from 'hooks/useAlert'
import { BarCodeReadEvent } from 'react-native-camera'
import { checkCameraPermission } from 'utils/permission'
import { RootStackParams } from 'types'
import { StackScreenProps } from '@react-navigation/stack'

type Props = StackScreenProps<RootStackParams>

const Screen = ({ navigation }: Props): ReactElement => {
  const setPassword = useSetRecoilState(RecoverWalletStore.password)
  const setName = useSetRecoilState(RecoverWalletStore.name)
  const setQRData = useSetRecoilState(RecoverWalletStore.qrData)
  const [seed, setSeed] = useRecoilState(RecoverWalletStore.seed)
  const [ableCamera, setAbleCamera] = useState(false)
  const { openQRScan } = useQRScan()
  const { navigate } = useNavigation()
  const { alert } = useAlert()

  const stepConfirmed = _.every(seed, _.some)

  const onRead = (e: BarCodeReadEvent): void => {
    let data
    try {
      data = JSON.parse(e.data)
    } catch {}

    if (
      typeof data === 'object' &&
      'address' in data &&
      'name' in data &&
      'privateKey' in data
    ) {
      setQRData(data)
      setName(data.name)
      navigate('Step2QR')
    } else {
      alert({ desc: 'Wrong QR Code' })
    }
  }

  const onPressQRScan = async (): Promise<void> => {
    openQRScan({
      onRead,
      checkPermission: (res) => {
        setAbleCamera(res)
      },
    })
  }

  const initStoreData = (): void => {
    setName('')
    setPassword('')
    setSeed([])
    setQRData(undefined)
    checkCameraPermission().then((res) => {
      setAbleCamera(res === 'granted')
    })
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      initStoreData()
    })
    initStoreData()
  }, [])

  return (
    <>
      <SubHeader
        theme={'sapphire'}
        title={'Recover existing wallet'}
      />
      <Body theme={'sky'} containerStyle={styles.container}>
        <View>
          <Button
            title={
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingHorizontal: 30,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    letterSpacing: 0,
                  }}
                  fontType={'medium'}
                >
                  Use seed phrase
                </Text>

                <Icon
                  name={'content-paste'}
                  size={24}
                  color={color.sapphire}
                />
              </View>
            }
            theme={'white'}
            containerStyle={{
              marginBottom: 20,
              borderWidth: 1,
              borderColor: '#d2d9f0',
            }}
            disabled={!stepConfirmed}
            onPress={(): void => navigate('Step2Seed')}
          />
          <Button
            onPress={onPressQRScan}
            theme="white"
            title={
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingHorizontal: 30,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    letterSpacing: 0,
                  }}
                  fontType={'medium'}
                >
                  Scan QR code
                </Text>

                <Icon
                  name={'qr-code-scanner'}
                  size={24}
                  color={color.sapphire}
                />
              </View>
            }
            containerStyle={{
              marginBottom: 20,
              borderWidth: 1,
              borderColor: '#d2d9f0',
            }}
          />
        </View>
        <View
          style={{
            opacity: 0.91,
            borderRadius: 8,
            backgroundColor: '#ebeff8',
            paddingHorizontal: 20,
            paddingVertical: 15,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              lineHeight: 18,
              letterSpacing: 0,
            }}
          >
            Generate QR code from <Icon name={'settings'} size={14} />
            settings menu of Terra Station desktop or extension
          </Text>
        </View>
        {ableCamera === false && (
          <View
            style={{
              opacity: 0.91,
              borderRadius: 8,
              backgroundColor: '#ffeff0',
              borderStyle: 'solid',
              borderWidth: 1,
              borderColor: 'rgba(255, 85, 97, 0.2)',
              paddingHorizontal: 20,
              paddingVertical: 15,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                lineHeight: 21,
                letterSpacing: 0,
                color: '#ff5561',
              }}
              fontType={'bold'}
            >
              Camera not authorized
            </Text>
            <Text
              style={{
                fontSize: 12,
                lineHeight: 18,
                letterSpacing: 0,
                color: '#ff5561',
              }}
            >
              You need to set up a camera in Settings
            </Text>
          </View>
        )}
      </Body>
    </>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default Screen

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    paddingTop: 20,
  },
})
