import { CommonActions } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View, Text, Button, Linking, Alert, Keyboard } from 'react-native'
import { Buffer } from 'buffer'
import { useAuth } from '@terra-money/use-native-station'
import { TextInput } from 'react-native-gesture-handler'
import EStyleSheet from 'react-native-extended-stylesheet'
import { getDecyrptedKey } from '../../utils/wallet'
import { LCDClient, RawKey, StdSignMsg } from '@terra-money/terra.js'

interface Props {
  navigation: any
  route: {
    params: {
      arg?: string
    }
  }
}

const RETURN_APP_SCHEME = 'mirrorapp://'

const lcdClient = new LCDClient({
  chainID: 'tequila-0004',
  URL: 'https://tequila-lcd.terra.dev',
})

interface SchemeArgs {
  return_scheme: string
  endpoint_address: string
}

const SendTxView = (props: Props) => {
  const [password, setPassword] = useState('1234567890')
  const { user } = useAuth()
  if (user === undefined) {
    Alert.alert('Error', 'Wallet not connected!', [
      { text: 'OK', onPress: () => gotoWallet() },
    ])
  }

  const [returnScheme, setReturnScheme] = useState('')
  const [endpointAddress, setEndpointAddress] = useState('')

  const [arg, setArg] = useState<SchemeArgs | undefined>(undefined)
  try {
    if (props.route.params.arg !== undefined) {
      setArg(
        JSON.parse(Buffer.from(props.route.params.arg, 'base64').toString())
      )
      props.route.params.arg = undefined
    }
  } catch (e) {
    Alert.alert(e.toString())
    console.log(e)
  }

  useEffect(() => {
    if (arg !== undefined) {
      console.log('arg', arg)
      setEndpointAddress(arg.endpoint_address)
      setReturnScheme(arg.return_scheme)
    }
  }, [arg])

  const getUnsignedTx = async (url: string) => {
    // {
    //   "stdSignMsg": {
    //     "account_number": 1234,
    //     "sequence": 1234,
    //     "fee": {
    //       "gas": "1234",
    //       "amount": []
    //     },
    //     "msgs": [
    //       {
    //         "type": "bank/MsgSend",
    //         "value": {
    //           "from_address": "terra1from",
    //           "to_address": "terra1to",
    //           "amount": []
    //         }
    //       }
    //     ]
    //   },
    //   "height": "0",
    //   "txhash": "D52FEA1636C2836A850E5D16B02023A5B988935759AA8F0B5E9734AF74990BC1",
    //   "raw_log": "insufficient fee: insufficient fees; got: \\\"1ukrw\\\", required: \\\"35610001ukrw,30000uluna,86325180umnt,20360usdr,30000uusd\\\" = \\\"35610000ukrw,30000uluna,86325180umnt,20360usdr,30000uusd\\\"(gas) +\\\"1ukrw\\\"(stability)",
    //   "code": "13"
    // }
    const response = await fetch(url, { method: 'GET' })
    console.log(response)

    if (response.status !== 200) {
      throw new Error(JSON.stringify(response))
    }

    const unsignedTx = await response.json()
    console.log(unsignedTx)

    return unsignedTx
  }

  const putTxResult = async (url: string, txResult: any) => {
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(txResult),
    })

    if (response.status !== 200) {
      throw new Error(JSON.stringify(response))
    }

    return
  }

  const BroadcastSignedTx = async (data: any) => {
    const decyrptedKey = await getDecyrptedKey(user?.name!, password)

    const rk = new RawKey(Buffer.from(decyrptedKey, 'hex'))
    const stdSignMsg = StdSignMsg.fromData(data.stdSignMsg)
    const signedTx = await rk.signTx(stdSignMsg)

    // const wallet = lcdClient.wallet(rk)
    // const msgs = [
    //   new MsgGrantAuthorization(
    //     wallet.key.accAddress,
    //     grantee,
    //     new SendAuthorization(spendLimit),
    //     duration
    //   ),
    // ]
    // const signedTx = await wallet.createAndSignTx({ msgs })
    const result = await lcdClient.tx.broadcastSync(signedTx)

    console.log(JSON.stringify(result))
  }

  const processSignedTx = async () => {
    // 1. get unsigned tx
    // 2. broadcast signed tx
    // 3. put tx result
    // 4. return app
    // loading 노출 여부?

    try {
      /*
      interface SignData {
        stdSignMsg: StdSignMsg;
        error?: string;
        txhash?: string;
      }
      */
      const unsignedTx = await getUnsignedTx(endpointAddress)
      console.log('unsignedTx', unsignedTx)
      const broadcastResult = await BroadcastSignedTx(unsignedTx)
      console.log('broadcastResult', broadcastResult)
      const putResult = await putTxResult(endpointAddress, broadcastResult)
      console.log('putResult', putResult)
      returnApp(returnScheme)
    } catch (e) {
      Alert.alert('Error', e.toString())
      console.log(e)
    }
  }

  const returnApp = (scheme: string) => {
    Linking.openURL(scheme)
  }

  const gotoDashboard = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: 'Tabs' }],
      })
    )
  }

  const gotoWallet = () => {
    props.navigation.navigate('AuthMenu')
  }

  return (
    <View style={{ flex: 1 }}>
      <Text>{`user: ${JSON.stringify(user)}`}</Text>
      <Text>{`arg: ${arg && JSON.stringify(arg)}`}</Text>
      <Text>{'Password: '}</Text>
      <TextInput
        style={styles.textInput}
        underlineColorAndroid='#ccc'
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}
        onSubmitEditing={Keyboard.dismiss}
      />
      {/* <Button
        title='1. GET UNSIGNED TX'
        onPress={(e) => getUnsignedTx(endpointAddress)}
      />
      <View style={{ margin: 4 }} />
      <Button
        title='2. BROADCAST SIGNED TX'
        onPress={(e) => BroadcastSignedTx('')}
      />
      <View style={{ margin: 4 }} />
      <Button
        title='3. PUT TX RESULT'
        onPress={(e) => putTxResult(endpointAddress)}
      />
      <View style={{ margin: 4 }} /> */}
      <Button
        title='SIGN'
        onPress={(e) => {
          processSignedTx()
        }}
      />
      <View style={{ margin: 4 }} />
      <Button
        title='RETURN APP'
        onPress={() => {
          Linking.openURL(RETURN_APP_SCHEME)
        }}
      />
      <View style={{ margin: 4 }} />
      <Button title='RETURN DASHBOARD' onPress={gotoDashboard} />
    </View>
  )
}

const styles = EStyleSheet.create({
  textInput: {
    marginLeft: 16,
    marginRight: 16,
  },
})

export default SendTxView
