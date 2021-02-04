import React, { ReactElement, useEffect, useState } from 'react'
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native'
import {
  RawKey,
  StdTx,
  SyncTxBroadcastResult,
} from '@terra-money/terra.js'
import SubHeader from 'components/layout/SubHeader'
import color from 'styles/color'
import font from 'styles/font'
import {
  BiometricButton,
  Button,
  FormInput,
  Icon,
  Text,
} from 'components'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth, useConfig } from 'use-station/src'
import { getDecyrptedKey } from 'utils/wallet'
import { useLoading } from 'hooks/useLoading'
import {
  DEBUG_TOPUP,
  getLCDClient,
  gotoDashboard,
  onPressComplete,
} from './TopupUtils'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParams } from 'types'
import { isSupportedBiometricAuthentication } from 'utils/bio'
import { getIsUseBioAuth } from 'utils/storage'
import StatusBar from 'components/StatusBar'

type Props = StackScreenProps<RootStackParams, 'SendTxPasswordView'>

const SendTxPasswordView = (props: Props): ReactElement => {
  const insets = useSafeAreaInsets()
  const { user } = useAuth()
  const { chain } = useConfig()
  const { showLoading, hideLoading } = useLoading()
  const [password, setPassword] = useState<string>('')
  const [signedTx, setSignedTx] = useState<StdTx>()
  const [error, setError] = useState<string>('')
  const [disableBioAuth, setDisableBioAuth] = useState(false)

  useEffect(() => {
    const checkBioAuth = async (): Promise<void> => {
      const support = await isSupportedBiometricAuthentication()
      const enable = await getIsUseBioAuth()

      setDisableBioAuth(!(support || enable))
    }
    checkBioAuth()
  }, [])

  useEffect(() => {
    signedTx !== undefined && processTransaction()
  }, [signedTx])

  const createSignedTx = async (
    bioPassword?: string
  ): Promise<void> => {
    try {
      const decyrptedKey = await getDecyrptedKey(
        user?.name || '',
        bioPassword ?? password
      )

      const rk = new RawKey(Buffer.from(decyrptedKey, 'hex'))
      setSignedTx(await rk.signTx(props.route.params.stdSignMsg))
    } catch (e) {
      setError(e.toString())
    }
  }

  const broadcastSignedTx = async (): Promise<SyncTxBroadcastResult> => {
    const result = await getLCDClient(
      chain.current.chainID,
      chain.current.lcd
    ).tx.broadcastSync(signedTx!)
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

  const processTransaction = async (): Promise<void> => {
    try {
      showLoading()

      const broadcastResult = await broadcastSignedTx()

      const putResult = await putTxResult(
        props.route.params.endpointAddress,
        broadcastResult
      )

      if (putResult.status !== 200) {
        props.navigation.replace('SendTxCompleteView', {
          success: false,
          title: `${putResult.status} error`,
          content: JSON.stringify(await putResult.json()),
          onPress: () =>
            onPressComplete(
              props.navigation,
              props.route.params.returnScheme
            ),
        })
      } else {
        props.navigation.replace('SendTxCompleteView', {
          onPress: () =>
            onPressComplete(
              props.navigation,
              props.route.params.returnScheme
            ),
        })
      }
    } catch (e) {
      props.navigation.replace('SendTxCompleteView', {
        success: false,
        title: `Unexpected error`,
        content: e.toString(),
        onPress: () =>
          onPressComplete(
            props.navigation,
            props.route.params.returnScheme
          ),
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
          onPress={(): void => gotoDashboard(props.navigation)}
        >
          <Icon name={'clear'} color={color.white} size={24} />
        </TouchableOpacity>
      </View>
      <SubHeader theme="sapphire" title="Enter your password" />
      <View style={style.contentContainer}>
        <Text fontType="medium" style={style.passwordText}>
          {'Password'}
        </Text>
        <FormInput
          style={style.formInputText}
          placeholderTextColor={color.sapphire_op50}
          placeholder={'Must be at least 10 characters'}
          secureTextEntry={true}
          onChangeText={(text): void => setPassword(text)}
          errorMessage={error}
          value={password}
        />
        {DEBUG_TOPUP && (
          <ScrollView style={style.debugContainer}>
            <Text style={style.debugText}>
              {`returnScheme: ${props.route.params.returnScheme}`}
            </Text>
            <Text style={style.debugText}>
              {`endpointAddress: ${props.route.params.endpointAddress}`}
            </Text>
            <Text style={style.debugText}>
              {`stdSignMsg: ${props.route.params.stdSignMsg.toJSON()}`}
            </Text>
          </ScrollView>
        )}
      </View>
      <View style={style.buttonContainer}>
        <Button
          theme="sapphire"
          title="Send"
          titleStyle={style.buttonTitle}
          titleFontType="medium"
          onPress={(): void => {
            createSignedTx()
          }}
        />
        {
          <>
            <View style={{ height: 10 }} />
            {user?.name && (
              <BiometricButton
                disabled={disableBioAuth}
                walletName={user?.name}
                onPress={({ isSuccess, password }): void => {
                  if (isSuccess) {
                    setPassword(password)
                    setTimeout(() => {
                      createSignedTx(password)
                    }, 300)
                  }
                }}
              />
            )}
          </>
        }
      </View>
    </KeyboardAvoidingView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  headerContainer: {
    backgroundColor: color.sapphire,
    height: 60,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  contentContainer: { flex: 1, marginHorizontal: 20 },

  passwordText: {
    fontSize: 14,
    lineHeight: 21,
    color: color.sapphire,
    marginTop: 20,
    marginBottom: 5,
  },
  formInputText: {
    fontFamily: font.gotham.book,
  },

  debugContainer: { alignSelf: 'flex-start' },
  debugText: { marginBottom: 4 },

  buttonContainer: {
    flexDirection: 'column',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonTitle: { fontSize: 16, lineHeight: 24 },
})

export default SendTxPasswordView
