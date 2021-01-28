import React, { ReactElement, useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import { CopyButton, Icon, Text } from 'components'

import { RootStackParams } from 'types/navigation'
import { useAuth, useManageAccounts } from 'use-station/src'
import useCurrency from 'use-station/src/contexts/useCurrency'
import color from 'styles/color'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { setUseBioAuth, getIsUseBioAuth } from 'utils/storage'
import { deleteWallet } from 'utils/wallet'
import { useAlert } from 'hooks/useAlert'

const Screen = (): ReactElement => {
  const { user, signOut } = useAuth()
  const { current } = useCurrency()
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()
  const { confirm } = useAlert()
  const { delete: deleteText } = useManageAccounts()

  const [isUseBioAuth, setIsUseBioAuth] = useState(false)

  const onPressDeleteWallet = async (): Promise<void> => {
    confirm({
      title: deleteText.title,
      desc: deleteText.content || '',
      onPressConfirmText: deleteText.button || '',
      onPressCancelText: deleteText.cancel || '',
      onPressConfirm: async (): Promise<void> => {
        if (user?.name) {
          const deleteResult = await deleteWallet({
            walletName: user.name,
          })
          if (deleteResult) {
            signOut()
            return
          }
        }
      },
    })
  }

  const onChangeIsUseBioAuth = (value: boolean): void => {
    setUseBioAuth({ isUse: value })
    setIsUseBioAuth(value)
  }

  const initPage = async (): Promise<void> => {
    setIsUseBioAuth(await getIsUseBioAuth())
  }

  useEffect(() => {
    initPage()
  }, [])

  return (
    <>
      {user ? (
        <View
          style={{
            backgroundColor: color.sapphire,
            height: 100,
            alignItems: 'center',
          }}
        >
          <Text style={styles.userName} fontType={'bold'}>
            {user.name}
          </Text>
          <Text style={styles.userAddress}>{user.address}</Text>
          <CopyButton
            copyString={user.address}
            theme={'sapphire'}
            containerStyle={{
              backgroundColor: '#2a52c1',
              borderColor: '#2a52c1',
            }}
          />
        </View>
      ) : (
        <SubHeader theme={'sapphire'} title={'settings'} />
      )}

      <Body
        theme={'sky'}
        scrollable
        containerStyle={{ paddingHorizontal: 0 }}
      >
        {user && (
          <View style={styles.section}>
            <View style={styles.itemBox}>
              <Text style={styles.itemName} fontType={'medium'}>
                Use Bio Auth
              </Text>
              <Switch
                value={isUseBioAuth}
                onValueChange={onChangeIsUseBioAuth}
              />
            </View>
            <TouchableOpacity
              style={styles.itemBox}
              onPress={(): void => {
                if (user.name) {
                  navigate('ChangePassword', {
                    walletName: user.name,
                  })
                } else {
                  Alert.alert('No wallet Name')
                }
              }}
            >
              <Text style={styles.itemName} fontType={'medium'}>
                Change password
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <TouchableOpacity style={styles.itemBox}>
            <Text style={styles.itemName} fontType={'medium'}>
              Currency
            </Text>
            <Text style={styles.itemValue} fontType={'medium'}>
              {current?.value}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemBox}>
            <Text style={styles.itemName} fontType={'medium'}>
              Network
            </Text>
          </TouchableOpacity>
        </View>

        {user ? (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.authItemBox}
              onPress={signOut}
            >
              <Text style={styles.authItemName} fontType={'bold'}>
                Disconnect
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.authItemBox}
              onPress={onPressDeleteWallet}
            >
              <Text
                style={[styles.authItemName, { color: '#ff5561' }]}
                fontType={'bold'}
              >
                Delete wallet
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.authItemBox}
              onPress={(): void => navigate('AuthMenu')}
            >
              <Icon
                name="account-balance-wallet"
                size={24}
                color="#2043b5"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.authItemName} fontType={'bold'}>
                Connect
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Body>
    </>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default Screen

const styles = StyleSheet.create({
  userName: {
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  userAddress: {
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 8,
  },
  section: {
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 35,
    shadowOpacity: 1,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  itemBox: {
    borderBottomColor: '#edf1f7',
    borderBottomWidth: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  itemValue: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    color: color.dodgerBlue,
  },
  authItemBox: {
    borderBottomColor: '#edf1f7',
    borderBottomWidth: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authItemName: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
})
