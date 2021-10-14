import React, { ReactElement, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { useRecoilState, useSetRecoilState } from 'recoil'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { AccAddress } from '@terra-money/terra.js'
import { StackScreenProps } from '@react-navigation/stack'

import { UTIL, COLOR } from 'consts'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import { Button, Text, Icon, QrCodeButton } from 'components'

import RecoverWalletStore from 'stores/RecoverWalletStore'
import { useAlert } from 'hooks/useAlert'
import { RecoverWalletStackParams } from 'types'

import {
  checkIfRecoverWalletQrCodeDataType,
  getRecoverWalletDataFromPayload,
} from 'utils/qrCode'

type Props = StackScreenProps<RecoverWalletStackParams, 'Step1'>

const Step1 = ({ navigation }: Props): ReactElement => {
  const setPassword = useSetRecoilState(RecoverWalletStore.password)
  const setName = useSetRecoilState(RecoverWalletStore.name)
  const setQRData = useSetRecoilState(RecoverWalletStore.qrData)
  const [seed, setSeed] = useRecoilState(RecoverWalletStore.seed)
  const { navigate } = useNavigation<
    NavigationProp<RecoverWalletStackParams>
  >()
  const { alert } = useAlert()

  const stepConfirmed = _.every(seed, _.some)

  const onRead = ({ data }: { data: string }): void => {
    const payload = UTIL.getParam({ url: data, key: 'payload' })

    const walletData = getRecoverWalletDataFromPayload(payload)

    if (
      walletData &&
      checkIfRecoverWalletQrCodeDataType(walletData)
    ) {
      setQRData(walletData)
      setName(walletData.name)
      navigate('Step2QR')
    } else {
      alert({ desc: 'Not a QR code for recovering wallets.' })
    }
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
      <SubHeader theme={'sapphire'} title={'Recover wallet'} />
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
                  color={COLOR.primary._02}
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
          <QrCodeButton
            onRead={onRead}
            stepNo={2}
            onlyIfScan={({ data }): string => {
              // If data is an address then return error
              if (AccAddress.validate(data)) {
                return 'This QR code is for copying addresses.\nTo recover wallets, use the \n"Export wallet with QR code"\nfunction.'
              }
              const payload = UTIL.getParam({
                url: data,
                key: 'payload',
              })

              const walletData = getRecoverWalletDataFromPayload(
                payload
              )

              return walletData &&
                checkIfRecoverWalletQrCodeDataType(walletData)
                ? ''
                : 'Not a QR code for recovering wallets.'
            }}
          >
            <View
              style={{
                marginBottom: 20,
                borderWidth: 1,
                borderColor: '#d2d9f0',
                height: 60,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
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
                  color={COLOR.primary._02}
                />
              </View>
            </View>
          </QrCodeButton>
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
                color={COLOR.primary._02}
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

Step1.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default Step1

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    paddingTop: 20,
  },
})
