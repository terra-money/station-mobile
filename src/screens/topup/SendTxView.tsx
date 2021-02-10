import React, { ReactElement, useEffect, useState } from 'react'
import {
  View,
  ViewProps,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { Buffer } from 'buffer'
import { useAuth, format, useBank } from 'use-station/src'
import { Text, Button, Select, Icon, FormInput } from 'components'

import { StdSignMsg } from '@terra-money/terra.js'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import color from 'styles/color'
import font from 'styles/font'
import BigNumber from 'bignumber.js'
import SubHeader from 'components/layout/SubHeader'
import { DEBUG_TOPUP } from './TopupUtils'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParams } from 'types'
import StatusBar from 'components/StatusBar'
import { useAlert } from 'hooks/useAlert'
import Preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'
import { useRecoilState } from 'recoil'
import TopupStore from 'stores/TopupStore'
import { useTopup } from 'hooks/useTopup'
import TopupLoadingIndicator from 'components/TopupLoadingIndicator'
import {
  authenticateBiometric,
  isSupportedBiometricAuthentication,
} from 'utils/bio'
import { getBioAuthPassword, getIsUseBioAuth } from 'utils/storage'
import useSignedTx from 'hooks/useSignedTx'

type Props = StackScreenProps<RootStackParams, 'SendTxView'>

interface SchemeArgs {
  return_scheme: string
  endpoint_address: string
}

const SendTxView = (props: Props): ReactElement => {
  const { user } = useAuth()
  const { data: bank } = useBank(user!)
  const { alert } = useAlert()
  const insets = useSafeAreaInsets()

  const [returnScheme, setReturnScheme] = useState('')
  const [endpointAddress, setEndpointAddress] = useState('')

  const [stdSignMsg, setStdSignMsg] = useRecoilState(
    TopupStore.stdSignMsg
  )

  const [feeDenom, setFeeDenom] = useState('')
  const [feeAmount, setFeeAmount] = useState('')

  const [loading, setLoading] = useState(false)
  const [enableNext, setEnableNext] = useState(false)
  const [bioAvailable, setBioAvailable] = useState(false)

  const { restoreApp } = useTopup()
  const { confirm } = useSignedTx(endpointAddress)

  useEffect(() => {
    // parse param
    try {
      if (props.route.params.payload !== undefined) {
        const payload: SchemeArgs = JSON.parse(
          Buffer.from(props.route.params.payload, 'base64').toString()
        )
        setEndpointAddress(payload.endpoint_address)
        setReturnScheme(payload.return_scheme)
      }
    } catch (e) {
      alert({
        title: 'Unexpected error',
        desc: e.toString(),
      })
    }

    // bio check
    const checkBioAuth = async (): Promise<void> => {
      const support = await isSupportedBiometricAuthentication()
      const enable = await getIsUseBioAuth()

      setBioAvailable(support && enable)
    }
    checkBioAuth()
  }, [])

  useEffect(() => {
    const getUnsignedMessage = async (): Promise<void> => {
      try {
        setLoading(true)
        const unsignedTx = await getUnsignedTx(endpointAddress)

        const signMsg = StdSignMsg.fromData(unsignedTx.stdSignMsg)

        if (signMsg) {
          const target = signMsg.fee.amount

          const amount = target.toArray()[0]?.amount.toString()
          amount && setFeeAmount(amount)

          const denom = target.toArray()[0]?.denom
          denom && setFeeDenom(denom)
        }
        setStdSignMsg(signMsg)
      } catch (e) {
        somethingWrong(e.toString())
      } finally {
        setLoading(false)
      }
    }

    const checkUserAddress = async (): Promise<void> => {
      const connectAddress = await Preferences.getString(
        PreferencesEnum.topupAddress
      )
      if (!connectAddress || connectAddress !== user?.address) {
        alert({
          title: 'Error',
          desc:
            'Current wallet address does not match tx wallet address.',
          onPressConfirmText: 'OK',
          onPressConfirm: (): void => {
            restoreApp(returnScheme)
          },
        })
      }
    }

    if (endpointAddress !== '' && returnScheme !== '') {
      getUnsignedMessage()
      checkUserAddress()
    }
  }, [endpointAddress, returnScheme])

  useEffect(() => {
    const available = bank?.balance.find((b) => b.denom === feeDenom)
      ?.available

    available &&
      new BigNumber(available).gt(feeAmount) &&
      setEnableNext(true)
  }, [bank, feeDenom, feeAmount])

  const getUnsignedTx = async (url: string): Promise<any> => {
    const response = await fetch(url, { method: 'GET' })

    if (response.status !== 200) {
      throw new Error(JSON.stringify(response))
    }

    return await response.json()
  }

  const somethingWrong = (content: string): void => {
    props.navigation.replace('SendTxCompleteView', {
      success: false,
      title: 'Something wrong',
      content,
      returnScheme,
    })
  }

  const confirmSignedTx = async (): Promise<void> => {
    const gotoPasswordView = (): void => {
      props.navigation.push('SendTxPasswordView', {
        returnScheme,
        endpointAddress,
      })
    }

    if (stdSignMsg === undefined) {
      somethingWrong('Undefined StdSignMsg')
    } else {
      if (bioAvailable) {
        const bioResult = await authenticateBiometric()
        if (bioResult) {
          const password = await getBioAuthPassword({
            walletName: user?.name || '',
          })
          await confirm(password, returnScheme)
        } else {
          gotoPasswordView()
        }
      } else {
        gotoPasswordView()
      }
    }
  }

  const TitleIcon = (props?: ViewProps): ReactElement => (
    <View style={[{ flexDirection: 'row' }, props?.style]}>
      <View style={{ width: 15, height: 40, overflow: 'hidden' }}>
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: 'transparent',
            borderColor: color.sapphire,
            borderWidth: 5,
            borderRadius: 20,
          }}
        />
      </View>
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: 'transparent',
          borderColor: color.sapphire,
          borderWidth: 5,
          borderRadius: 20,
        }}
      />
    </View>
  )

  return (
    <View
      style={[
        style.container,
        {
          marginBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar theme="sapphire" />
      <View
        style={{
          height: insets.top,
          backgroundColor: color.sapphire,
        }}
      />
      <View style={style.headerContainer}>
        <TouchableOpacity
          onPress={(): void => {
            restoreApp(returnScheme)
          }}
        >
          <Icon name={'clear'} color={color.white} size={24} />
        </TouchableOpacity>
      </View>
      <SubHeader theme={'sapphire'} title={'Confirm'} />
      <View style={style.contentContainer}>
        <TitleIcon style={style.titleIcon} />
        <Text fontType="book" style={style.titleText}>
          {'Would you like to allow charging in CHAI?'}
        </Text>
        <View style={style.feeTextContainer}>
          <Text fontType="medium" style={style.feeText}>
            {'Fees'}
          </Text>
        </View>
        <View style={style.feeContainer}>
          <Select
            disabled={true}
            selectedValue={format.denom(feeDenom)}
            optionList={[
              {
                label: format.denom(feeDenom),
                value: format.denom(feeDenom),
              },
            ]}
            onValueChange={(): void => {
              // Do nothing
            }}
            textStyle={style.denomText}
            containerStyle={style.denomContainer}
          />
          <View style={{ width: 10 }} />
          <View style={style.amountContainer}>
            <FormInput
              style={style.amountText}
              value={
                feeAmount &&
                new BigNumber(feeAmount).dividedBy(1e6).toString()
              }
              editable={false}
              errorMessage={
                enableNext && feeAmount !== ''
                  ? undefined
                  : 'Insufficient balance'
              }
            />
          </View>
        </View>
        {DEBUG_TOPUP && (
          <ScrollView style={style.debugContainer}>
            <Text
              style={style.debugText}
            >{`returnScheme: ${returnScheme}`}</Text>
            <Text
              style={style.debugText}
            >{`endpointAddress: ${endpointAddress}`}</Text>
            <Text
              style={style.debugText}
            >{`stdSignMsg: ${stdSignMsg?.toJSON()}`}</Text>
          </ScrollView>
        )}
      </View>
      <View style={style.buttonContainer}>
        <Button
          theme="sapphire"
          title="Next"
          titleStyle={style.buttonText}
          titleFontType="medium"
          onPress={confirmSignedTx}
          disabled={!enableNext}
        />
      </View>
      {loading && <TopupLoadingIndicator />}
    </View>
  )
}

const style = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column' },
  headerContainer: {
    backgroundColor: color.sapphire,
    height: 60,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 60,
  },

  titleIcon: { marginBottom: 15 },
  titleText: {
    fontSize: 16,
    lineHeight: 24,
    color: color.sapphire,
    marginBottom: 60,
  },

  feeTextContainer: { alignSelf: 'flex-start', marginBottom: 5 },
  feeText: { fontSize: 14, lineHeight: 21 },

  feeContainer: { flexDirection: 'row' },
  denomText: {
    fontSize: 14,
    color: color.sapphire,
    paddingLeft: 15,
  },
  denomContainer: {
    flex: 1,
    backgroundColor: color.disabled,
  },
  amountContainer: {
    flex: 2,
  },
  amountText: {
    color: color.sapphire,
    fontFamily: font.gotham.book,
    fontVariant: ['tabular-nums'],
  },

  debugContainer: { alignSelf: 'flex-start' },
  debugText: { marginBottom: 4 },

  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: { fontSize: 16, lineHeight: 24 },
})

export default SendTxView
