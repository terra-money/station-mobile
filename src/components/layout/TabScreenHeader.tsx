import React, { ReactElement } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native'

import { StackNavigationOptions } from '@react-navigation/stack'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import { navigationHeaderOptions as defaultNHO } from 'components/layout/Header'
import { Text, Icon } from 'components'

import color from 'styles/color'
import { useAuth } from 'use-station/src'
import { useNavigation } from '@react-navigation/native'
import images from 'assets/images'

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
  const { navigate } = useNavigation()
  return (
    <View style={styles.headerRight}>
      {user ? (
        <TouchableOpacity onPress={(): void => navigate('Setting')}>
          <Image
            source={images.wallet_settings}
            style={{ width: 28, height: 28 }}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.unSignedMenu}>
          <TouchableOpacity
            onPress={(): void => navigate('AuthMenu')}
          >
            <View style={styles.connectButton}>
              <Icon
                name="account-balance-wallet"
                size={14}
                color="#2043b5"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.connectText} fontType={'medium'}>
                CONNECT
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={(): void => navigate('Setting')}>
            <Icon name="settings" size={24} color="#2043b5" />
          </TouchableOpacity>
        </View>
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
  },
  unSignedMenu: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    borderColor: color.sapphire,
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    height: 28,
  },
  connectText: {
    color: color.sapphire,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: -0.4,
  },
})
