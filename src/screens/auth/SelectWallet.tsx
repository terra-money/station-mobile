import React, { useState, useEffect, ReactElement } from 'react'
import { Alert, Text, StyleSheet, View, Image } from 'react-native'
import { useAuth } from '@terra-money/use-native-station'
import { StackNavigationOptions } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import _ from 'lodash'

import { getWallets, testPassword } from 'utils/wallet'
import useOnAuth from './useOnAuth'

import Header from 'components/layout/Header'
import Body from 'components/layout/Body'
import Button from 'components/Button'
import Select from 'components/Select'
import Input from 'components/Input'

import color from 'styles/color'
import images from 'assets/images'

const BiometricButtonTitle = (): ReactElement => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Image
        source={images.bio_face}
        style={{ width: 20, height: 20, marginRight: 10 }}
      />
      <Text style={{ color: color.sapphire }}>Biometric</Text>
    </View>
  )
}

const Screen = (): ReactElement => {
  const [initPageComplete, setInitPageComplete] = useState(false)
  const [wallets, setWallets] = useState<LocalWallet[]>([])
  useOnAuth()
  const { goBack } = useNavigation()

  const { signIn } = useAuth()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('1234567890')

  const submit = async (): Promise<void> => {
    try {
      if ((await testPassword({ name, password })) === false)
        throw new Error('Wrong Password!')
      const wallet = wallets.find((w) => w.name === name)
      wallet && signIn(wallet)
    } catch (e) {
      Alert.alert(e.toString())
    }
  }
  const initPage = async (): Promise<void> => {
    const wallets = await getWallets()
    if (_.some(wallets)) {
      setWallets(wallets)
      setName(wallets[0].name)
      setInitPageComplete(true)
    } else {
      Alert.alert('No Wallets')
      goBack()
    }
  }

  useEffect(() => {
    initPage()
  }, [])

  return (
    <>
      {initPageComplete && (
        <>
          <Body
            type={'sky'}
            containerStyle={{ paddingBottom: 50, paddingTop: 10 }}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.section}>
                <Text style={styles.title}>Wallet</Text>
                <Select
                  selectedValue={name}
                  optionList={wallets.map(({ name }) => {
                    return {
                      label: name,
                      value: name,
                    }
                  })}
                  onValueChange={(itemValue): void => {
                    setName(`${itemValue}`)
                  }}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.title}>Password</Text>
                <Input
                  underlineColorAndroid="#ccc"
                  value={password}
                  secureTextEntry
                  onChangeText={setPassword}
                  placeholder={'Must be at least 10 characters'}
                />
              </View>
            </View>

            <Button
              title="Next"
              type={'blue'}
              onPress={submit}
              containerStyle={{ marginBottom: 10 }}
            />
            <Button
              title={<BiometricButtonTitle />}
              type={'gray'}
              onPress={(): void => {
                Alert.alert('Comming Soon')
              }}
            />
          </Body>
        </>
      )}
    </>
  )
}

const navigationOptions = (): StackNavigationOptions => {
  return {
    animationEnabled: false,
    header: (): ReactElement => (
      <Header
        type={'blue'}
        goBackIconType="close"
        headerBottomTitle={'Select Wallet'}
      />
    ),
  }
}

Screen.navigationOptions = navigationOptions

export default Screen

const styles = StyleSheet.create({
  title: {
    color: color.sapphire,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
})
