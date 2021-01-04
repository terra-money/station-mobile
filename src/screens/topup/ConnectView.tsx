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

const ConnectView = (props: Props) => {
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

  const sendConnect = async (url: string) => {
    const data = new FormData()
    data.append('', '')

    const ret = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    })

    // 이후 처리?
  }

  const returnApp = (scheme: string) => {
    Linking.openURL(scheme)
  }

  const SendTx = async (msg: string) => {
    try {
      const decyrptedKey = await getDecyrptedKey(user?.name!, password)

      const rk = new RawKey(Buffer.from(decyrptedKey, 'hex'))
      const stdSignMsg = StdSignMsg.fromData(msg as any)
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
      Alert.alert(JSON.stringify(result))
    } catch (e) {
      console.log(e)
      Alert.alert(e.toString())
    }
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
      <Button title='SEND CONNECT' onPress={(e) => sendConnect('')} />
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

export default ConnectView
