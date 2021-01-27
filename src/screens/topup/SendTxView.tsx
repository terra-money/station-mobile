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
} from 'react-native'
import { Buffer } from 'buffer'
import { useAuth } from 'use-station/src'

import { Text, Button } from 'components'

import {
  Coin,
  Coins,
  LCDClient,
  RawKey,
  StdFee,
  StdSignMsg,
} from '@terra-money/terra.js'
import { getDecyrptedKey } from 'utils/wallet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import color from 'styles/color'
import { amount } from 'use-station/src/utils/format'

interface Props {
  navigation: any
  route: {
    params: {
      arg?: string
    }
  }
}

const lcdClient = new LCDClient({
  chainID: 'tequila-0004',
  URL: 'https://tequila-lcd.terra.dev',
  gasPrices: {
    uluna: '0.15',
    uusd: '0.15',
    usdr: '0.1018',
    ukrw: '178.05',
    umnt: '431.6259',
  },
})

interface SchemeArgs {
  return_scheme: string
  endpoint_address: string
}

const SendTxView = (props: Props): ReactElement => {
  const [password, setPassword] = useState('')
  const { user } = useAuth()
  const insets = useSafeAreaInsets()

  if (user === undefined) {
    Alert.alert('Error', 'Wallet not connected!', [
      { text: 'OK', onPress: (): void => gotoWallet() },
    ])
  }

  const [returnScheme, setReturnScheme] = useState('')
  const [endpointAddress, setEndpointAddress] = useState('')

  const [stdSignMsg, setStdSignMsg] = useState<StdSignMsg>(undefined)

  const [loading, setLoading] = useState<boolean>(false)
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
      setLoading(true)
      const unsignedTx = await getUnsignedTx(endpointAddress)
      setStdSignMsg(StdSignMsg.fromData(unsignedTx.stdSignMsg))
      setLoading(false)
    }
    endpointAddress !== '' && getUnsignedMessage()
  }, [endpointAddress])

  useEffect(() => {
    try {
      console.log('stdSignMsg', stdSignMsg)
      stdSignMsg !== undefined &&
        lcdClient.tx
          .estimateFee(stdSignMsg)
          .then((stdFee: StdFee) => {
            console.log('stdFee', stdFee)
          })
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

  const putTxResult = async (
    url: string,
    txResult: any
  ): Promise<Response> => {
    for (const k in txResult) {
      if (txResult.hasOwnProperty(k) && txResult[k] !== undefined) {
        txResult[k] = String(txResult[k])
      }
    }

    const init = {
      method: 'PUT',
      headers: {
        Origin: 'https://topup.terra.dev',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(txResult),
    }

    return await fetch(url, init)
  }

  const BroadcastSignedTx = async (data: any): Promise<any> => {
    const decyrptedKey = await getDecyrptedKey(
      user?.name || '',
      password
    )

    const rk = new RawKey(Buffer.from(decyrptedKey, 'hex'))
    const stdSignMsg = StdSignMsg.fromData(data.stdSignMsg)
    const signedTx = await rk.signTx(stdSignMsg)

    const result = await lcdClient.tx.broadcastSync(signedTx)
    return result
  }

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
  const processSignedTx = async (): Promise<void> => {
    try {
      setLoading(true)

      const broadcastResult = await BroadcastSignedTx(unsignedTx)
      const putResult = await putTxResult(
        endpointAddress,
        broadcastResult
      )

      if (putResult.status !== 200) {
        Alert.alert(
          `${putResult.status} error`,
          JSON.stringify(await putResult.json())
        )
      } else {
        Alert.alert('', 'SUCCESS', [
          {
            text: 'OK',
            onPress: (): void => returnApp(returnScheme),
          },
        ])
      }
    } catch (e) {
      Alert.alert('Unexpected Error', e.toString())
    } finally {
      setLoading(false)
    }
  }

  const returnApp = (scheme: string): void => {
    Linking.openURL(scheme)
  }

  const gotoDashboard = (): void => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: 'Tabs' }],
      })
    )
  }

  const gotoWallet = (): void => {
    props.navigation.navigate('AuthMenu')
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
        { flex: 1, flexDirection: 'column' },
        {
          marginTop: insets.top,
          marginBottom: insets.bottom,
        },
      ]}
    >
      <View></View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          marginHorizontal: 20,
          marginTop: 60,
        }}
      >
        <TitleIcon style={{ marginBottom: 5 }} />
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
        <View style={{ alignSelf: 'flex-start' }}>
          <Text
            fontType="medium"
            style={{ fontSize: 14, lineHeight: 21 }}
          >
            {'Fees'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text>{'KRT'}</Text>
          <Text>{'0.123456'}</Text>
        </View>
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
          onPress={() => processSignedTx()}
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
