import React, { ReactElement, useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Buffer } from 'buffer'
import { useAuth } from 'use-station/src'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Button, Icon, Text } from 'components'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import color from 'styles/color'
import {
  DEBUG_TOPUP,
  gotoDashboard,
  gotoWallet,
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

type Props = StackScreenProps<RootStackParams, 'ConnectView'>

interface SchemeArgs {
  return_scheme: string
  endpoint_address: string
}

const ConnectView = (props: Props): ReactElement => {
  const { user } = useAuth()
  const { alert } = useAlert()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (user === undefined) {
      alert({
        title: 'Error',
        desc: 'Wallet not connected!',
        onPressConfirmText: 'OK',
        onPressConfirm: () => gotoWallet(props.navigation),
      })
    }
  }, [])

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
    alert({ title: 'Unexpected error', desc: e.toString() })
  }

  useEffect(() => {
    if (arg !== undefined) {
      setEndpointAddress(arg.endpoint_address)
      setReturnScheme(arg.return_scheme)
    } else {
      alert({
        title: 'Parameter error',
        desc: 'Argument is null',
        onPressConfirmText: 'OK',
        onPressConfirm: () => gotoDashboard(props.navigation),
      })
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

  const processConnect = async (): Promise<void> => {
    try {
      setLoading(true)
      const ret = await putConnect(endpointAddress, user?.address)

      if (ret.status !== 200) {
        alert({
          title: `${ret.status} error`,
          desc: JSON.stringify(await ret.json()),
        })
      } else {
        user?.address &&
          (await Preferences.setString(
            PreferencesEnum.topupAddress,
            user.address
          ))
        restoreApp(props.navigation, returnScheme, alert)
      }
    } catch (e) {
      alert({
        title: 'Unexpected Error',
        desc: e.toString(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View
      style={[
        style.container,
        {
          marginTop: insets.top,
          marginBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar theme="white" />
      <View style={style.closeView}>
        <TouchableOpacity
          onPress={(): void => {
            restoreApp(props.navigation, returnScheme, alert)
          }}
        >
          <Icon name="close" color={color.sapphire} size={24} />
        </TouchableOpacity>
      </View>
      <View style={style.contentView}>
        <Icon
          name="account-balance-wallet"
          color={color.sapphire}
          size={60}
        />
        <Text fontType="bold" style={style.titleText}>
          {'Allow Access to wallet'}
        </Text>
        {user?.address && (
          <Text fontType="book" style={style.contentText}>
            {`CHAI wants to access “${
              user?.name
            } - ${user?.address.substring(
              0,
              6
            )}...${user?.address.substr(user?.address.length - 5)}”`}
          </Text>
        )}
        {DEBUG_TOPUP && (
          <View style={style.debugContainer}>
            <Text
              style={style.debugText}
            >{`address: ${user?.address}`}</Text>
            <Text
              style={style.debugText}
            >{`returnScheme: ${returnScheme}`}</Text>
            <Text
              style={style.debugText}
            >{`endpointAddress: ${endpointAddress}`}</Text>
          </View>
        )}
      </View>
      <View style={style.buttonView}>
        <Button
          title={'Allow'}
          theme={'sapphire'}
          containerStyle={style.buttonContainer}
          titleStyle={style.buttonTitle}
          titleFontType={'medium'}
          onPress={(): void => {
            processConnect()
          }}
        />
        <View style={{ marginHorizontal: 5 }} />
        <Button
          title={'Deny'}
          theme={'red'}
          containerStyle={style.buttonContainer}
          titleStyle={style.buttonTitle}
          titleFontType={'medium'}
          onPress={(): void => {
            restoreApp(props.navigation, returnScheme, alert)
          }}
        />
      </View>
      {loading && <LoadingIndicator />}
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  closeView: {
    marginVertical: 18,
    marginLeft: 20,
  },
  contentView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonTitle: {
    fontSize: 16,
    lineHeight: 24,
  },

  titleText: { fontSize: 24, lineHeight: 36, marginVertical: 5 },
  contentText: { fontSize: 16, lineHeight: 24, textAlign: 'center' },

  debugContainer: { alignSelf: 'flex-start' },
  debugText: { marginBottom: 4 },

  buttonContainer: { flex: 1, height: 60 },
})

export default ConnectView
