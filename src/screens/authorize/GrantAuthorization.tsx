import { CommonActions } from '@react-navigation/native'
import React, { useState } from 'react'
import { View, Text, Button, Linking, Alert } from 'react-native'
import { Buffer } from 'buffer'
import { useAuth } from '@terra-money/use-native-station'
import { TextInput } from 'react-native-gesture-handler'
import EStyleSheet from 'react-native-extended-stylesheet'
import { getDecyrptedKey } from '../../utils/wallet'
import {
  Int,
  LCDClient,
  MsgGrantAuthorization,
  RawKey,
  SendAuthorization,
} from '@terra-money/terra.js'

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

const GrantAuthorization = (props: Props) => {
  const [password, setPassword] = useState('1234567890')

  const { user } = useAuth()
  if (user === undefined) {
    Alert.alert('Error', 'Wallet not connected!', [
      { text: 'OK', onPress: () => gotoWallet() },
    ])
  }

  const arg =
    props.route.params.arg === undefined
      ? 'undefined'
      : Buffer.from(props.route.params.arg, 'base64').toString()

  const grantee = ''
  const spendLimit = ''
  const duration = new Int(0)

  const sendAuthorization = async () => {
    try {
      const decyrptedKey = await getDecyrptedKey(user?.name!, password)
      const msgs = [
        new MsgGrantAuthorization(
          user!.address,
          grantee,
          new SendAuthorization(spendLimit),
          duration
        ),
      ]

      const rk = new RawKey(Buffer.from(decyrptedKey, 'hex'))
      const wallet = lcdClient.wallet(rk)
      const signedTx = await wallet.createAndSignTx({ msgs })
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
      <Text>{`arg: ${arg}`}</Text>
      <Text>{'Password: '}</Text>
      <TextInput
        style={styles.textInput}
        underlineColorAndroid='#ccc'
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Button title='SEND AUTHORIZATION' onPress={sendAuthorization} />
      <Button
        title='RETURN APP'
        onPress={() => {
          Linking.openURL(RETURN_APP_SCHEME)
        }}
      />
      <Button title='RETURN DASHBOARD' onPress={gotoDashboard} />
    </View>
  )
}

export default GrantAuthorization

const styles = EStyleSheet.create({
  textInput: {
    marginLeft: 16,
    marginRight: 16,
  },
})
