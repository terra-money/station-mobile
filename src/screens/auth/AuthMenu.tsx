import React, { ReactElement, useEffect, useState } from 'react'
import _ from 'lodash'
import { View, StyleSheet, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import Body from 'components/layout/Body'

import { Text, Icon, Button, Dot } from 'components'

import { getWallets } from 'utils/wallet'
import { COLOR } from 'consts'
import images from 'assets/images'
import StatusBar from 'components/StatusBar'
import { navigationHeaderOptions } from 'components/layout/Header'
import { useRecoilState } from 'recoil'
import TopupStore from 'stores/TopupStore'

const AuthMenu = (): ReactElement => {
  const [initPageComplete, setInitPageComplete] = useState(false)
  const [wallets, setWallets] = useState<LocalWallet[]>()
  const { navigate } = useNavigation()

  const [connectAddress, setConnectAddress] = useRecoilState(
    TopupStore.connectAddress
  )

  const initPage = async (): Promise<void> => {
    setWallets(await getWallets())
    setInitPageComplete(true)
  }

  useEffect(() => {
    initPage()
  }, [])

  useEffect(() => {
    if (initPageComplete && connectAddress) {
      navigate('SelectWallet', { connectAddress })
    }
  }, [initPageComplete, connectAddress])

  return (
    <>
      <StatusBar theme="sapphire" />
      {initPageComplete && (
        <Body
          theme={'sapphire'}
          containerStyle={{ paddingBottom: 50, paddingTop: 10 }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.title} fontType={'bold'}>
              Connect
            </Text>
            <Text style={styles.subTitle}>
              {_.some(wallets)
                ? 'Connect to a wallet, create a new wallet or recover an existing wallet using a seed phrase or QR code'
                : 'Create a new wallet or recover an existing wallet using a seed phrase or QR code'}
            </Text>
            <View style={styles.imageBox}>
              <Icon
                name={'account-balance-wallet'}
                size={45}
                color={COLOR.white}
                style={{ marginHorizontal: 6 }}
              />
              <Dot style={{ opacity: 0.25, marginHorizontal: 6 }} />
              <Dot style={{ opacity: 0.5, marginHorizontal: 6 }} />
              <Dot style={{ opacity: 0.75, marginHorizontal: 6 }} />
              <Image
                source={images.satelite}
                style={{ width: 45, height: 45, marginHorizontal: 6 }}
              />
            </View>
          </View>
          <View>
            {_.some(wallets) && (
              <Button
                theme={'white'}
                title={'Select wallet'}
                onPress={(): void => {
                  navigate('SelectWallet')
                }}
                containerStyle={{ marginBottom: 10 }}
              />
            )}

            <Button
              theme={_.some(wallets) ? 'transparent' : 'white'}
              title={'New wallet'}
              onPress={(): void => {
                setConnectAddress(undefined)
                navigate('NewWallet')
              }}
            />

            <View style={styles.orBox}>
              <Text style={styles.orText}>OR</Text>
            </View>
            <Button
              theme={'transparent'}
              title={'Recover wallet'}
              onPress={(): void => {
                setConnectAddress(undefined)
                navigate('RecoverWallet')
              }}
            />
          </View>
        </Body>
      )}
    </>
  )
}

AuthMenu.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
  headerLeft: (): ReactElement => <View />,
})

export default AuthMenu

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    lineHeight: 39,
    letterSpacing: 0,
    textAlign: 'center',
    color: COLOR.white,
  },
  subTitle: {
    marginHorizontal: 20,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
    color: COLOR.white,
  },
  imageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  orBox: {
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,.3)',
    alignItems: 'center',
    marginVertical: 30,
  },
  orText: {
    marginBottom: -10,
    paddingHorizontal: 10,
    backgroundColor: COLOR.primary._02,
    color: 'white',
  },
})
