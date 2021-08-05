import React, { ReactElement } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native'

import { StackNavigationOptions } from '@react-navigation/stack'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import { navigationHeaderOptions as defaultNHO } from 'components/layout/Header'
import { QrCodeButton, Text } from 'components'

import color from 'styles/color'
import { useAuth } from 'use-station/src'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import images from 'assets/images'
import { RootStackParams } from 'types'
import { getParam, isTerraAddress } from 'utils/util'
import { parseDynamicLinkURL } from 'utils/scheme'

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

  const onlyIfScan = ({ data }: { data: string }): string => {
    const linkUrl = parseDynamicLinkURL(data)
    const appSheme =
      data.includes('terrastation:') &&
      !!getParam({ url: data, key: 'payload' })
    const readable =
      // if kind of address
      isTerraAddress(data) ||
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
                Linking.openURL(data)
              } else if (isTerraAddress(data)) {
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
                        Linking.openURL(
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
    color: color.sapphire,
    height: 36,
  },
  headerRight: {
    paddingRight: 20,
    flexDirection: 'row',
  },
})
