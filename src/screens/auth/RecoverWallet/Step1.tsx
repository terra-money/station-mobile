import React, { ReactElement, useEffect } from 'react'
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
import { RecoverWalletStackParams } from 'types'
import { StackScreenProps } from '@react-navigation/stack'
import { jsonTryParse, getParam } from 'utils/util'

type Props = StackScreenProps<RecoverWalletStackParams, 'Step1'>

const Screen = ({ navigation }: Props): ReactElement => {
  const setPassword = useSetRecoilState(RecoverWalletStore.password)
  const setName = useSetRecoilState(RecoverWalletStore.name)
  const setQRData = useSetRecoilState(RecoverWalletStore.qrData)
  const [seed, setSeed] = useRecoilState(RecoverWalletStore.seed)
  const { openQRScan } = useQRScan()
  const { navigate } = useNavigation()
  const { alert } = useAlert()

  const stepConfirmed = _.every(seed, _.some)

  const onRead = (e: BarCodeReadEvent): void => {
    const payload = getParam({ url: e.data, key: 'payload' })
    const bufferString = Buffer.from(payload, 'base64').toString()
    const data = jsonTryParse<RecoverWalletQrCodeDataType>(
      bufferString
    )

    if (
      data &&
      typeof data === 'object' &&
      'address' in data &&
      'name' in data &&
      'encrypted_key' in data
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
    })
  }

  const initStoreData = (): void => {
    setName('')
    setPassword('')
    setSeed([])
    setQRData(undefined)
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      initStoreData()
    })
    initStoreData()
    return unsubscribe
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
            Generate QR code from{' '}
            <View style={{ width: 15 }}>
              <Icon
                name={'settings'}
                size={14}
                color={color.sapphire}
                style={{
                  position: 'absolute',
                  marginTop: -12,
                }}
              />
            </View>
            settings menu of Terra Station desktop or extension
          </Text>
        </View>
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
