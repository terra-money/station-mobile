import React, { ReactElement } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native'
import { StackNavigationOptions } from '@react-navigation/stack'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { AccAddress } from '@terra-money/terra.js'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'

import { UTIL, COLOR } from 'consts'

import { navigationHeaderOptions as defaultNHO } from 'components/layout/Header'
import { QrCodeButton, Text } from 'components'

import { useAuth } from 'lib'
import images from 'assets/images'
import { RootStackParams } from 'types'
import { parseDynamicLinkURL } from 'utils/scheme'
import useLinking from 'hooks/useLinking'

const HeaderLeft = ({ title }: { title: string }): ReactElement => {
  return (
    <View style={styles.headerLeft}>
      <Text style={styles.headerLeftTitle} fontType={'bold'}>
        {title}
      </Text>
    </View>
  )
}

const HeaderRight = (): ReactElement => {
  const { user } = useAuth()
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()
  const { openURL } = useLinking()

  const onlyIfScan = ({ data }: { data: string }): string => {
    const linkUrl = parseDynamicLinkURL(data)
    const appSheme =
      data.includes('terrastation:') &&
      !!UTIL.getParam({ url: data, key: 'payload' })
    const readable =
      // if kind of address
      AccAddress.validate(data) ||
      // if dynamic link
      !!linkUrl ||
      // if app scheme
      appSheme
    return readable ? '' : 'Not a valid QR code.'
  }
  return (
    <View style={styles.headerRight}>
      {user && (
        <>
          <QrCodeButton
            onlyIfScan={onlyIfScan}
            onRead={({ data }): void => {
              if (data.includes('terrastation:')) {
                openURL(data)
              } else if (AccAddress.validate(data)) {
                navigate('SelectCoinToSend', { toAddress: data })
              } else {
                const linkUrl = parseDynamicLinkURL(data)
                if (linkUrl) {
                  const action = linkUrl.searchParams.get('action')
                  const payload = linkUrl.searchParams.get('payload')

                  if (action && payload) {
                    switch (action) {
                      case 'wallet_connect':
                        navigate('WalletConnect', { uri: payload })
                        break
                      default:
                        openURL(
                          `terrastation://${action}/?payload=${payload}`
                        )
                        break
                    }
                  }
                }
              }
            }}
          >
            <View style={{ marginRight: 15 }}>
              <Image
                source={images.take_qrcode}
                style={{ width: 28, height: 28 }}
              />
            </View>
          </QrCodeButton>

          <TouchableOpacity onPress={(): void => navigate('Setting')}>
            <Image
              source={images.wallet_settings}
              style={{ width: 28, height: 28 }}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

export const navigationHeaderOptions = ({
  title,
}: {
  title: string
}): StackNavigationOptions => {
  return defaultNHO({
    theme: 'sky',
    headerStyle: {
      height: 80 + getStatusBarHeight(),
    },
    headerLeft: () => <HeaderLeft {...{ title }} />,
    headerRight: () => <HeaderRight />,
  })
}

const styles = StyleSheet.create({
  headerLeft: {
    paddingLeft: 20,
    paddingVertical: 22,
  },
  headerLeftTitle: {
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: -0.4,
    color: COLOR.primary._02,
    height: 36,
  },
  headerRight: {
    paddingRight: 20,
    flexDirection: 'row',
  },
})
