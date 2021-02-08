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
import {
  DEBUG_TOPUP,
  LoadingIndicator,
  restoreApp,
} from './TopupUtils'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParams } from 'types'
import StatusBar from 'components/StatusBar'
import { useAlert } from 'hooks/useAlert'
import Preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'

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
  const [arg, setArg] = useState<SchemeArgs | undefined>(undefined)

  const [stdSignMsg, setStdSignMsg] = useState<StdSignMsg>()

  const [feeDenom, setFeeDenom] = useState('')
  const [feeAmount, setFeeAmount] = useState('')

  const [loading, setLoading] = useState(false)
  const [enableNext, setEnableNext] = useState(false)

  useEffect(() => {
    try {
      if (props.route.params.arg !== undefined) {
        setArg(
          JSON.parse(
            Buffer.from(props.route.params.arg, 'base64').toString()
          )
        )
      }
    } catch (e) {
      alert({
        title: 'Unexpected error',
        desc: e.toString(),
      })
    }
  }, [])

  useEffect(() => {
    const checkUserAddress = async (): Promise<void> => {
      const connectAddress = await Preferences.getString(
        PreferencesEnum.topupAddress
      )
      if (!connectAddress || connectAddress !== user?.address) {
        alert({
          title: 'Error',
          desc: 'Not match connected wallet!',
          onPressConfirmText: 'OK',
          onPressConfirm: (): void => {
            restoreApp(props.navigation, returnScheme, alert)
          },
        })
      }
    }
    checkUserAddress()
  }, [user])

  useEffect(() => {
    const getUnsignedMessage = async (): Promise<void> => {
      try {
        setLoading(true)
        const unsignedTx = await getUnsignedTx(endpointAddress)
        setStdSignMsg(StdSignMsg.fromData(unsignedTx.stdSignMsg))
      } catch (e) {
        somethingWrong(e.toString())
      } finally {
        setLoading(false)
      }
    }

    endpointAddress !== '' &&
      returnScheme !== '' &&
      getUnsignedMessage()
  }, [endpointAddress, returnScheme])

  useEffect(() => {
    if (stdSignMsg) {
      const amount = stdSignMsg.fee.amount
        .get('ukrw')
        ?.amount.toString()
      amount && setFeeAmount(amount)

      const denom = stdSignMsg.fee.amount.get('ukrw')?.denom
      denom && setFeeDenom(denom)
    }
  }, [stdSignMsg])

  useEffect(() => {
    const available = bank?.balance.find((b) => b.denom === feeDenom)
      ?.available

    available &&
      new BigNumber(available).gt(feeAmount) &&
      setEnableNext(true)
  }, [bank, feeDenom, feeAmount])

  useEffect(() => {
    if (arg !== undefined) {
      setEndpointAddress(arg.endpoint_address)
      setReturnScheme(arg.return_scheme)
    }
  }, [arg])

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
      onPress: (): void => {
        restoreApp(props.navigation, returnScheme, alert)
      },
    })
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
            restoreApp(props.navigation, returnScheme, alert)
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
              // containerStyle={style.amountContainer}
              style={style.amountText}
              value={new BigNumber(feeAmount)
                .dividedBy(1e6)
                .toString()}
              editable={false}
              errorMessage={
                enableNext ? undefined : 'Insufficient balance'
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
          onPress={(): void => {
            if (stdSignMsg === undefined) {
              somethingWrong('undefined StdSignMsg')
            } else {
              props.navigation.replace('SendTxPasswordView', {
                stdSignMsg,
                returnScheme,
                endpointAddress,
              })
            }
          }}
          disabled={!enableNext}
        />
      </View>
      {loading && <LoadingIndicator />}
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
