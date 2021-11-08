import React, { ReactElement, useEffect, useState } from 'react'
import { View, StyleSheet, BackHandler } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'

import { COLOR } from 'consts'

import { Buffer } from 'buffer'
import { useAuth } from 'lib'

import { Button, Icon, Text } from 'components'
import { DEBUG_TOPUP } from './TopupUtils'
import { RootStackParams } from 'types'
import StatusBar from 'components/StatusBar'
import { useAlert } from 'hooks/useAlert'
import { useTopup } from 'hooks/useTopup'
import TopupLoadingIndicator from 'components/TopupLoadingIndicator'

type Props = StackScreenProps<RootStackParams, 'ConnectView'>

interface SchemeArgs {
  return_scheme: string
  endpoint_address: string
}

const ConnectView = (props: Props): ReactElement => {
  const { user } = useAuth()
  const { alert } = useAlert()
  const { restoreApp, gotoWallet } = useTopup()
  const insets = useSafeAreaInsets()
  const [returnScheme, setReturnScheme] = useState('')
  const [endpointAddress, setEndpointAddress] = useState('')

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    // check user account
    if (user === undefined) {
      alert({
        title: 'Error',
        desc: 'Wallet not connected!',
        onPressConfirmText: 'OK',
        onPressConfirm: gotoWallet,
      })
    } else {
      // parse deeplink param
      try {
        if (props.route.params.payload !== undefined) {
          const payload: SchemeArgs = JSON.parse(
            Buffer.from(
              props.route.params.payload,
              'base64'
            ).toString()
          )
          setEndpointAddress(payload.endpoint_address)
          setReturnScheme(payload.return_scheme)
        }
      } catch (e) {
        alert({ title: 'Unexpected Error', desc: e.toString() })
      }
    }
  }, [])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', (): boolean => {
      returnScheme && restoreApp(returnScheme)
      return true
    })
    return (): void => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        (): boolean => {
          returnScheme && restoreApp(returnScheme)
          return true
        }
      )
    }
  }, [returnScheme])

  const putConnect = async (
    url: string,
    address?: string
  ): Promise<Response> => {
    const init = {
      method: 'PUT',
      headers: {
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

      if (ret.status === 200) {
        restoreApp(returnScheme)
      } else {
        alert({
          title: `${ret.status} error`,
          desc: JSON.stringify(await ret.json()),
        })
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
            restoreApp(returnScheme)
          }}
        >
          <Icon name="close" color={COLOR.primary._02} size={24} />
        </TouchableOpacity>
      </View>
      <View style={style.contentView}>
        <Icon
          name="account-balance-wallet"
          color={COLOR.primary._02}
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
          title={'Deny'}
          theme={'red'}
          containerStyle={style.buttonContainer}
          titleStyle={style.buttonTitle}
          titleFontType={'medium'}
          onPress={(): void => {
            restoreApp(returnScheme)
          }}
        />
        <View style={{ marginHorizontal: 5 }} />
        <Button
          title={'Allow'}
          theme={'sapphire'}
          containerStyle={style.buttonContainer}
          titleStyle={style.buttonTitle}
          titleFontType={'medium'}
          onPress={processConnect}
        />
      </View>
      {loading && <TopupLoadingIndicator />}
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
