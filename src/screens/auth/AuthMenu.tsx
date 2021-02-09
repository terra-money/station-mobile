import React, { ReactElement, useEffect, useState } from 'react'
import _ from 'lodash'
import { View, StyleSheet, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import Body from 'components/layout/Body'

import { Text, Icon, Button, Dot } from 'components'

import { getWallets } from 'utils/wallet'
import color from 'styles/color'
import images from 'assets/images'
import StatusBar from 'components/StatusBar'
import { navigationHeaderOptions } from 'components/layout/Header'

const Screen = (): ReactElement => {
  const [initPageComplete, setInitPageComplete] = useState(false)
  const [wallets, setWallets] = useState<LocalWallet[]>()
  const { navigate } = useNavigation()

  const initPage = async (): Promise<void> => {
    setWallets(await getWallets())
    setInitPageComplete(true)
  }

  useEffect(() => {
    initPage()
  }, [])

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
                ? 'Connect to your wallet, create a new wallet or recover an existing wallet using a seed phrase or QR code'
                : 'Create a new wallet or recover an existing wallet using a seed phrase or QR code'}
            </Text>
            <View style={styles.imageBox}>
              <Icon
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
            {_.some(wallets) && (
              <Button
                theme={'white'}
                title={'Select wallet'}
                onPress={(): void => navigate('SelectWallet')}
                containerStyle={{ marginBottom: 10 }}
              />
            )}

            <Button
              theme={_.some(wallets) ? 'transparent' : 'white'}
              title={'New wallet'}
              onPress={(): void => navigate('NewWallet')}
            />

            <View style={styles.orBox}>
              <Text style={styles.orText}>OR</Text>
            </View>
            <Button
              theme={'transparent'}
              title={'Recover existing wallet'}
              onPress={(): void => navigate('RecoverWallet')}
            />
          </View>
        </Body>
      )}
    </>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
  headerLeft: (): ReactElement => <View />,
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
    borderColor: 'rgba(255,255,255,.3)',
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
