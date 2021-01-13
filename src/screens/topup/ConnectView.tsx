import { CommonActions } from '@react-navigation/native'
import React, { ReactElement, useEffect, useState } from 'react'
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

const ConnectView = (props: Props): ReactElement => {
  const [password, setPassword] = useState('1234567890')
  const { user } = useAuth()
  if (user === undefined) {
    Alert.alert('Error', 'Wallet not connected!', [
      { text: 'OK', onPress: (): void => gotoWallet() },
    ])
  }

  const [returnScheme, setReturnScheme] = useState('')
  const [endpointAddress, setEndpointAddress] = useState('')

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
    if (arg !== undefined) {
      setEndpointAddress(arg.endpoint_address)
      setReturnScheme(arg.return_scheme)
    } else {
      // exception case!
    }
  }, [arg])

  const putConnect = async (
    url: string,
    address?: string
  ): Promise<Response> => {
    const init = {
      method: 'PUT',
      headers: {
        Origin: 'https://topup.terra.dev',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    }

    return await fetch(url, init)
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

  const processConnect = async (): Promise<void> => {
    try {
      setLoading(true)
      const ret = await putConnect(endpointAddress, user?.address)

      if (ret.status !== 200) {
        Alert.alert(`${ret.status} error`, await ret.json())
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

  return (
    <>
      <View style={{ flex: 1 }}>
        <Text>{`user: ${JSON.stringify(user)}`}</Text>
        <Text>{`arg: ${arg && JSON.stringify(arg)}`}</Text>
        <Text>{'Password: '}</Text>
        <TextInput
          style={styles.textInput}
          underlineColorAndroid="#ccc"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          onSubmitEditing={Keyboard.dismiss}
        />
        <Button title="CONNECT" onPress={processConnect} />
        <View style={{ margin: 4 }} />
        <Button
          title="RETURN APP"
          onPress={(): void => {
            Linking.openURL(returnScheme)
          }}
        />
        <View style={{ margin: 4 }} />
        <Button title="RETURN DASHBOARD" onPress={gotoDashboard} />
      </View>

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
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
    </>
  )
}

const styles = EStyleSheet.create({
  textInput: {
    marginLeft: 16,
    marginRight: 16,
  },
})

export default ConnectView
