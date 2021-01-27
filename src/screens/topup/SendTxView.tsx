import { CommonActions } from '@react-navigation/native'
import React, { ReactElement, useEffect, useState } from 'react'
import {
  View,
  Linking,
  Alert,
  Keyboard,
  ActivityIndicator,
  StyleSheet,
  ViewProps,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { Buffer } from 'buffer'
import { useAuth, format } from 'use-station/src'
import { Text, Button, Select, Input, Icon } from 'components'

import {
  Coin,
  Coins,
  LCDClient,
  RawKey,
  StdFee,
  StdSignMsg,
  SyncTxBroadcastResult,
} from '@terra-money/terra.js'
import { getDecyrptedKey } from 'utils/wallet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import color from 'styles/color'
import { amount } from 'use-station/src/utils/format'
import BigNumber from 'bignumber.js'
import SubHeader from 'components/layout/SubHeader'
import { DEBUG_TOPUP, gotoDashboard, gotoWallet } from './TopupUtils'

interface Props {
  navigation: any
  route: {
    params: {
      arg?: string
    }
  }
}

interface SchemeArgs {
  return_scheme: string
  endpoint_address: string
}

const SendTxView = (props: Props): ReactElement => {
  const { user } = useAuth()
  const insets = useSafeAreaInsets()

  if (user === undefined) {
    Alert.alert('Error', 'Wallet not connected!', [
      {
        text: 'OK',
        onPress: (): void => gotoWallet(props.navigation),
      },
    ])
  }

  const [returnScheme, setReturnScheme] = useState('')
  const [endpointAddress, setEndpointAddress] = useState('')

  const [stdSignMsg, setStdSignMsg] = useState<StdSignMsg>()

  const [feeDenom, setFeeDenom] = useState('')
  const [feeAmount, setFeeAmount] = useState('')

  const [arg, setArg] = useState<SchemeArgs | undefined>(undefined)
  try {
    if (props.route.params.arg !== undefined) {
      setArg(
        JSON.parse(
          Buffer.from(props.route.params.arg, 'base64').toString()
        )
      )
      props.route.params.arg = undefined
    }
  } catch (e) {
    Alert.alert(e.toString())
  }

  useEffect(() => {
    const getUnsignedMessage = async (): Promise<void> => {
      const unsignedTx = await getUnsignedTx(endpointAddress)
      setStdSignMsg(StdSignMsg.fromData(unsignedTx.stdSignMsg))
    }
    endpointAddress !== '' && getUnsignedMessage()
  }, [endpointAddress])

  useEffect(() => {
    try {
      setFeeAmount(
        new BigNumber(stdSignMsg.fee.amount.get('ukrw')?.amount)
          .dividedBy(1e6)
          .toString()
      )
      setFeeDenom(
        format.denom(stdSignMsg.fee.amount.get('ukrw')?.denom)
      )
      // setFeeAmount(stdSignMsg.fee)
      // setFeeDenom(stdSignMsg.fee.amount.denom)
      // stdSignMsg !== undefined &&
      //   lcdClient.tx
      //     .estimateFee(stdSignMsg)
      //     .then((stdFee: StdFee) => {
      //     })
    } catch (e) {}
  }, [stdSignMsg])

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

  // const putTxResult = async (
  //   url: string,
  //   txResult: any
  // ): Promise<Response> => {
  //   for (const k in txResult) {
  //     if (txResult.hasOwnProperty(k) && txResult[k] !== undefined) {
  //       txResult[k] = String(txResult[k])
  //     }
  //   }

  //   const init = {
  //     method: 'PUT',
  //     headers: {
  //       Origin: 'https://topup.terra.dev',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(txResult),
  //   }

  //   return await fetch(url, init)
  // }

  // const BroadcastSignedTx = async (
  //   stdSignMsg: StdSignMsg
  // ): Promise<SyncTxBroadcastResult> => {
  //   const decyrptedKey = await getDecyrptedKey(
  //     user?.name || '',
  //     password
  //   )

  //   const rk = new RawKey(Buffer.from(decyrptedKey, 'hex'))
  //   const signedTx = await rk.signTx(stdSignMsg)

  //   const result = await lcdClient.tx.broadcastSync(signedTx)
  //   return result
  // }

  /**
   * {
   "stdSignMsg":{
      "account_number":"25917",
      "chain_id":"tequila-0004",
      "fee":{
         "amount":[
            {
               "amount":"16019515",
               "denom":"ukrw"
            }
         ],
         "gas":"89972"
      },
      "memo":"",
      "msgs":[
         {
            "type":"msgauth/MsgGrantAuthorization",
            "value":{
               "authorization":{
                  "type":"msgauth/SendAuthorization",
                  "value":{
                     "spend_limit":[
                        {
                           "amount":"1000000000000000",
                           "denom":"ukrw"
                        }
                     ]
                  }
               },
               "grantee":"terra1na2r5d5ele6hh2fz44avgzw5cxvem2j0aaz0nk",
               "granter":"terra1rmmkd4f5f9u7z48gly57x6tj4prqdju5n77544",
               "period":"3153600000000000000"
            }
         }
      ],
      "sequence":"0"
   }
}
   */
  // const processSignedTx = async (): Promise<void> => {
  //   try {
  //     setLoading(true)

  //     const broadcastResult = await BroadcastSignedTx(stdSignMsg)
  //     const putResult = await putTxResult(
  //       endpointAddress,
  //       broadcastResult
  //     )

  //     if (putResult.status !== 200) {
  //       Alert.alert(
  //         `${putResult.status} error`,
  //         JSON.stringify(await putResult.json())
  //       )
  //     } else {
  //       Alert.alert('', 'SUCCESS', [
  //         {
  //           text: 'OK',
  //           onPress: (): void => returnApp(returnScheme),
  //         },
  //       ])
  //     }
  //   } catch (e) {
  //     Alert.alert('Unexpected Error', e.toString())
  //   } finally {
  //     setLoading(false)
  //   }
  // }

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
        { flex: 1, flexDirection: 'column' },
        {
          marginTop: insets.top,
          marginBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={color.sapphire}
        translucent={false}
      />
      <View
        style={{
          backgroundColor: color.sapphire,
          height: 60,
          paddingLeft: 20,
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity
          onPress={(): void => gotoDashboard(props.navigation)}
        >
          <Icon name={'clear'} color={color.white} size={24} />
        </TouchableOpacity>
      </View>
      <SubHeader theme={'sapphire'} title={'Confirm'} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          marginHorizontal: 20,
          marginTop: 60,
        }}
      >
        <TitleIcon style={{ marginBottom: 15 }} />
        <Text
          fontType="book"
          style={{
            fontSize: 16,
            lineHeight: 24,
            color: color.sapphire,
            marginBottom: 60,
          }}
        >
          {'Would you like to allow charging in CHAI?'}
        </Text>
        <View style={{ alignSelf: 'flex-start', marginBottom: 5 }}>
          <Text
            fontType="medium"
            style={{ fontSize: 14, lineHeight: 21 }}
          >
            {'Fees'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Select
            disabled={true}
            selectedValue={feeDenom}
            optionList={[{ label: feeDenom, value: feeDenom }]}
            onValueChange={(): void => {}}
            textStyle={{
              fontSize: 14,
              lineHeight: 21,
              color: color.sapphire,
            }}
            containerStyle={{
              flex: 1,
              backgroundColor: color.disabled,
            }}
          />
          <View style={{ width: 10 }} />
          <Input
            style={{ flex: 2 }}
            value={feeAmount}
            editable={false}
          />
        </View>
        {DEBUG_TOPUP && (
          <ScrollView style={{ alignSelf: 'flex-start' }}>
            <Text
              style={{ marginBottom: 4 }}
            >{`returnScheme: ${returnScheme}`}</Text>
            <Text
              style={{ marginBottom: 4 }}
            >{`endpointAddress: ${endpointAddress}`}</Text>
            <Text
              style={{ marginBottom: 4 }}
            >{`stdSignMsg: ${stdSignMsg?.toJSON()}`}</Text>
          </ScrollView>
        )}
      </View>
      <View
        style={{
          marginHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <Button
          theme="sapphire"
          title="Next"
          titleStyle={{ fontSize: 16, lineHeight: 24 }}
          titleFontType="medium"
          onPress={(): void => {
            props.navigation.replace('SendTxPasswordView', {
              stdSignMsg,
              returnScheme,
              endpointAddress,
            })
            stdSignMsg
          }}
        />
      </View>
    </View>
    // <View style={{ flex: 1 }}>
    //   <Text>{`user: ${JSON.stringify(user)}`}</Text>
    //   <Text>{`arg: ${arg && JSON.stringify(arg)}`}</Text>
    //   <Text>{'Password: '}</Text>
    //   <TextInput
    //     style={styles.textInput}
    //     underlineColorAndroid="#ccc"
    //     value={password}
    //     secureTextEntry
    //     onChangeText={setPassword}
    //     onSubmitEditing={Keyboard.dismiss}
    //   />
    //   <Button title="SIGN" onPress={processSignedTx} />
    //   <View style={{ margin: 4 }} />
    //   <Button
    //     title="RETURN APP"
    //     onPress={(): void => {
    //       Linking.openURL(returnScheme)
    //     }}
    //   />
    //   <View style={{ margin: 4 }} />
    //   <Button title="RETURN DASHBOARD" onPress={gotoDashboard} />

    //   {/* LOADING INDICATOR */}
    //   {loading && (
    //     <View
    //       style={{
    //         position: 'absolute',
    //         flex: 1,
    //         width: '100%',
    //         height: '100%',
    //         backgroundColor: 'rgba(0,0,0,0.5)',
    //         alignContent: 'center',
    //         justifyContent: 'center',
    //       }}
    //     >
    //       <ActivityIndicator size="large" color="#000" />
    //     </View>
    //   )}
    // </View>
  )
}

export default SendTxView
