import React, { ReactElement } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'

import { RootStackParams } from 'types/navigation'
import { User } from 'lib'
import { Text, CopyButton, Icon } from 'components'
import color from 'styles/color'

const WalletAddress = ({ user }: { user: User }): ReactElement => {
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()
  return (
    <View style={styles.container}>
      <View style={styles.userAddressBox}>
        <CopyButton
          copyString={user.address}
          theme={'sapphire'}
          containerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginRight: 10,
          }}
          activeOpacity={0.8}
        >
          <View style={{ marginRight: 10 }}>
            <Text
              style={styles.userAddress}
              numberOfLines={1}
              ellipsizeMode={'middle'}
            >
              {user.address}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              borderRadius: 15,
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 6,
              paddingVertical: 6,
              borderColor: 'rgba(255,255,255,.5)',
            }}
          >
            <Icon name={'content-paste'} color={color.white} />
          </View>
        </CopyButton>
      </View>

      <TouchableOpacity
        style={styles.qrCode}
        onPress={(): void => {
          navigate('Setting')
        }}
      >
        <Icon name="qr-code-2" color={color.white} />
      </TouchableOpacity>
    </View>
  )
}

export default WalletAddress

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: color.sapphire,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 35,
    shadowOpacity: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  userAddressBox: {
    color: '#ffffff',
    flex: 1,
    marginRight: 10,
  },
  userAddress: {
    fontSize: 13,
    color: '#ffffff',
  },
  qrCode: {
    marginLeft: 10,
    borderColor: 'rgba(255,255,255,.5)',
    backgroundColor: color.sapphire,
    flexDirection: 'row',
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
})
