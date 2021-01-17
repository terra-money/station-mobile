import React, { ReactElement } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { StackNavigationOptions } from '@react-navigation/stack'

import { navigationHeaderOptions as defaultNHO } from 'components/layout/Header'
import Text from 'components/Text'
import color from 'styles/color'
import { useAuth } from '@terra-money/use-native-station'
import { useNavigation } from '@react-navigation/native'

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
        <TouchableOpacity onPress={(): void => navigate('AuthMenu')}>
          <MaterialIcons
            name="account-balance-wallet"
            size={28}
            color="#2043b5"
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.unSignedMenu}>
          <TouchableOpacity
            onPress={(): void => navigate('AuthMenu')}
          >
            <View style={styles.connectButton}>
              <MaterialIcons
                name="account-balance-wallet"
                size={14}
                color="#2043b5"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.connectText}>CONNECT</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={(): void => navigate('Setting')}>
            <MaterialIcons
              name="settings"
              size={24}
              color="#2043b5"
            />
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
    borderColor: '#2043b5',
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  connectText: {
    color: color.sapphire,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: -0.4,
  },
})
