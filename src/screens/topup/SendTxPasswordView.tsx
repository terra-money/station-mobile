import React, { ReactElement, useEffect, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  LCDClient,
  RawKey,
  StdSignMsg,
  StdTx,
  SyncTxBroadcastResult,
} from '@terra-money/terra.js'
import SubHeader from 'components/layout/SubHeader'
import color from 'styles/color'
import { Button, FormInput, Icon, Input, Text } from 'components'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from 'use-station/src'
import { getDecyrptedKey } from 'utils/wallet'
import { CommonActions } from '@react-navigation/native'
import { useLoading } from 'hooks/useLoading'
import { DEBUG_TOPUP, gotoDashboard, restoreApp } from './TopupUtils'

interface Props {
  navigation: any
  route: {
    params: {
      stdSignMsg: StdSignMsg
      returnScheme: string
      endpointAddress: string
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

const SendTxPasswordView = (props: Props): ReactElement => {
  const insets = useSafeAreaInsets()
  const { user } = useAuth()
  const { showLoading, hideLoading } = useLoading()
  const [password, setPassword] = useState<string>('')
  const [signedTx, setSignedTx] = useState<StdTx>()
  const [error, setError] = useState<string>('')

  useEffect(() => {
    console.log('password', password)
  }, [password])

  useEffect(() => {
    signedTx !== undefined && processTransaction()
  }, [signedTx])

  const createSignedTx = async (): Promise<void> => {
    try {
      const decyrptedKey = await getDecyrptedKey(
        user?.name || '',
        password
      )

      const rk = new RawKey(Buffer.from(decyrptedKey, 'hex'))
      setSignedTx(await rk.signTx(props.route.params.stdSignMsg))
    } catch (e) {
      setError(e.toString())
    }
  }
  const broadcastSignedTx = async (): Promise<SyncTxBroadcastResult> => {
    const result = await lcdClient.tx.broadcastSync(signedTx!)
    return result
    // if (typeof result === 'object' && 'code' in result) {
    //   if (result.code) {
    //     throw result.raw_log
    //   } else {
    //     return result
    //   }
    // }
    // throw new Error('UnknownError' + result)
  }

  const putTxResult = async (
    url: string,
    txResult: any
  ): Promise<Response> => {
    console.log('url', url)
    for (const k in txResult) {
      if (txResult.hasOwnProperty(k) && txResult[k] !== undefined) {
        txResult[k] = String(txResult[k])
      }
    }
    console.log('txResult', txResult)

    const init = {
      method: 'PUT',
      headers: {
        // Origin: 'https://topup.terra.dev',
        // 'Content-Type': 'application/json',
      },
      body: JSON.stringify(txResult),
    }

    return await fetch(url, init)
  }

  const onPressComplete = (): void => {
    restoreApp(props.navigation, props.route.params.returnScheme)
  }

  const processTransaction = async (): Promise<void> => {
    try {
      showLoading()

      const broadcastResult = await broadcastSignedTx()
      console.log('broadcastResult', broadcastResult)

      const putResult = await putTxResult(
        props.route.params.endpointAddress,
        broadcastResult
      )
      console.log('putResult', putResult)

      if (putResult.status !== 200) {
        props.navigation.replace('SendTxCompleteView', {
          success: false,
          title: `${putResult.status} error`,
          content: JSON.stringify(await putResult.json()),
          onPress: onPressComplete,
        })
      } else {
        props.navigation.replace('SendTxCompleteView', {
          onPress: onPressComplete,
        })
      }
    } catch (e) {
      props.navigation.replace('SendTxCompleteView', {
        success: false,
        title: `Unexpected error`,
        content: e.toString(),
        onPress: onPressComplete,
      })
    } finally {
      setTimeout(() => {
        hideLoading()
      }, 500)
    }
  }

  return (
    <KeyboardAvoidingView
      style={[
        {
          flex: 1,
          flexDirection: 'column',
        },
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
      <SubHeader theme="sapphire" title="Enter your password" />
      <View style={{ flex: 1, marginHorizontal: 20 }}>
        <Text
          fontType="medium"
          style={{
            fontSize: 14,
            lineHeight: 21,
            color: color.sapphire,
            marginTop: 20,
            marginBottom: 5,
          }}
        >
          {'Password'}
        </Text>
        <FormInput
          style={{
            fontFamily: 'Gotham-Book',
          }}
          placeholderTextColor={color.sapphire_op50}
          placeholder={'Must be at least 10 characters'}
          secureTextEntry={true}
          onChangeText={(text): void => setPassword(text)}
          errorMessage={error}
        />
        {DEBUG_TOPUP && (
          <ScrollView style={{ alignSelf: 'flex-start' }}>
            <Text style={{ marginBottom: 4 }}>
              {`returnScheme: ${props.route.params.returnScheme}`}
            </Text>
            <Text style={{ marginBottom: 4 }}>
              {`endpointAddress: ${props.route.params.endpointAddress}`}
            </Text>
            <Text style={{ marginBottom: 4 }}>
              {`stdSignMsg: ${props.route.params.stdSignMsg.toJSON()}`}
            </Text>
          </ScrollView>
        )}
      </View>
      <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
        <Button
          theme="sapphire"
          title="Send"
          titleStyle={{ fontSize: 16, lineHeight: 24 }}
          titleFontType="medium"
          onPress={() => {
            createSignedTx()
          }}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

export default SendTxPasswordView
