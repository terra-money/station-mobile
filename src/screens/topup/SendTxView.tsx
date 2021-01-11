import { CommonActions } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Button,
  Linking,
  Alert,
  Keyboard,
  ActivityIndicator,
} from 'react-native'
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

  const [loading, setLoading] = useState<boolean>(false)
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
  }

  useEffect(() => {
    if (arg !== undefined) {
      setEndpointAddress(arg.endpoint_address)
      setReturnScheme(arg.return_scheme)
    }
  }, [arg])

  const getUnsignedTx = async (url: string) => {
    const response = await fetch(url, { method: 'GET' })

    if (response.status !== 200) {
      throw new Error(JSON.stringify(response))
    }

    return await response.json()
  }

  const putTxResult = async (url: string, txResult: any) => {
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

  const BroadcastSignedTx = async (data: any) => {
    const decyrptedKey = await getDecyrptedKey(user?.name!, password)

    const rk = new RawKey(Buffer.from(decyrptedKey, 'hex'))
    const stdSignMsg = StdSignMsg.fromData(data.stdSignMsg)
    const signedTx = await rk.signTx(stdSignMsg)

    const result = await lcdClient.tx.broadcastSync(signedTx)
    return result
  }

  const processSignedTx = async () => {
    try {
      setLoading(true)
      const unsignedTx = await getUnsignedTx(endpointAddress)
      const broadcastResult = await BroadcastSignedTx(unsignedTx)
      const putResult = await putTxResult(endpointAddress, broadcastResult)

      if (putResult.status !== 200) {
        Alert.alert(`${putResult.status} error`, await putResult.json())
      } else {
        Alert.alert('', 'SUCCESS', [
          {
            text: 'OK',
            onPress: () => returnApp(returnScheme),
          },
        ])
      }
    } catch (e) {
      Alert.alert('Unexpected Error', e.toString())
    } finally {
      setLoading(false)
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
          Linking.openURL(returnScheme)
        }}
      />
      <View style={{ margin: 4 }} />
      <Button title='RETURN DASHBOARD' onPress={gotoDashboard} />

      {/* LOADING INDICATOR */}
      {loading && (
        <View
          style={{
            position: 'absolute',
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator size='large' color='#000' />
        </View>
      )}
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
