import React, { ReactElement, useEffect, useState } from 'react'
import _ from 'lodash'
import { View, StyleSheet, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from 'use-station/src'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'

import Text from 'components/Text'
import Button from 'components/Button'
import Dot from 'components/Dot'

import { settings, clearKeys } from 'utils/storage'
import { getWallets } from 'utils/wallet'
import color from 'styles/color'
import images from 'assets/images'

const Screen = (): ReactElement => {
  const [initPageComplete, setInitPageComplete] = useState(false)
  const [wallets, setWallets] = useState<LocalWallet[]>()
  const { navigate } = useNavigation()
  const { user, signOut } = useAuth()

  const initPage = async (): Promise<void> => {
    setWallets(await getWallets())
    setInitPageComplete(true)
  }

  useEffect(() => {
    initPage()
  }, [])

  return (
    <>
      {initPageComplete && (
        <Body
          theme={'blue'}
          containerStyle={{ paddingBottom: 50, paddingTop: 10 }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.title} fontType={'bold'}>
              Connect
            </Text>
            <Text style={styles.subTitle}>
              {_.some(wallets)
                ? 'Connect to your wallet, Create a new wallet or recover an existing wallet using a seed phrase'
                : 'Create a new wallet or recover an existing wallet using a seed phrase'}
            </Text>
            <View style={styles.imageBox}>
              <MaterialIcon
                name={'account-balance-wallet'}
                size={45}
                color={color.white}
              />
              <Dot style={{ opacity: 0.25 }} />
              <Dot style={{ opacity: 0.5 }} />
              <Dot style={{ opacity: 0.75 }} />
              <Image
                source={images.satelite}
                style={{ width: 45, height: 45 }}
              />
            </View>
          </View>
          <View>
            {__DEV__ && (
              <View
                style={{ flexDirection: 'row', marginBottom: 10 }}
              >
                <View style={{ flex: 1 }}>
                  <Button
                    theme={'red'}
                    title={'(DEV) Clear settings'}
                    onPress={settings.clear}
                    containerStyle={{
                      height: 30,
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    theme={'red'}
                    title={'(DEV) Clear keys'}
                    onPress={clearKeys}
                    containerStyle={{
                      height: 30,
                    }}
                  />
                </View>
              </View>
            )}
            {_.isEmpty(user) ? (
              <>
                {_.some(wallets) && (
                  <Button
                    theme={'white'}
                    title={'Select Wallet'}
                    onPress={(): void => navigate('SelectWallet')}
                    containerStyle={{ marginBottom: 10 }}
                  />
                )}

                <Button
                  theme={_.some(wallets) ? 'transparent' : 'white'}
                  title={'New Wallet'}
                  onPress={(): void => navigate('NewWallet')}
                />

                <View style={styles.orBox}>
                  <Text style={styles.orText}>OR</Text>
                </View>
                <Button
                  theme={'transparent'}
                  title={'Recover Existing Wallet'}
                  onPress={(): void => navigate('RecoverWallet')}
                />
              </>
            ) : (
              <>
                <Button
                  theme={'white'}
                  title={'Sign Out'}
                  onPress={signOut}
                />
              </>
            )}
          </View>
        </Body>
      )}
    </>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  theme: 'blue',
  goBackIconType: 'close',
})

export default Screen

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    lineHeight: 39,
    letterSpacing: 0,
    textAlign: 'center',
    color: color.white,
  },
  subTitle: {
    marginHorizontal: 20,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
    color: color.white,
  },
  imageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 110,
    paddingTop: 20,
  },
  orBox: {
    borderBottomWidth: 1,
    borderColor: color.white,
    alignItems: 'center',
    marginVertical: 30,
  },
  orText: {
    marginBottom: -10,
    paddingHorizontal: 10,
    backgroundColor: color.sapphire,
    color: 'white',
  },
})
