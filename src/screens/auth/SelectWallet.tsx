import React, { useState, useEffect, ReactElement } from 'react'
import { Alert, StyleSheet, View, Image } from 'react-native'
import { useAuth } from 'use-station/src'
import { useNavigation } from '@react-navigation/native'
import _ from 'lodash'

import { getWallets, testPassword } from 'utils/wallet'
import useOnAuth from './useOnAuth'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'

import Text from 'components/Text'
import Button from 'components/Button'
import Select from 'components/Select'
import Input from 'components/Input'

import color from 'styles/color'
import images from 'assets/images'
import FormLabel from 'components/FormLabel'

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
        <Body
          theme={'sky'}
          containerStyle={{
            paddingBottom: 50,
            paddingTop: 10,
            justifyContent: 'space-between',
          }}
        >
          <View>
            <View style={styles.section}>
              <FormLabel text={'Wallet'} />
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
              <FormLabel text={'Password'} />
              <Input
                underlineColorAndroid="#ccc"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                placeholder={'Must be at least 10 characters'}
              />
            </View>
          </View>
          <View>
            <Button
              title="Next"
              theme={'blue'}
              onPress={submit}
              containerStyle={{ marginBottom: 10 }}
            />
            <Button
              title={<BiometricButtonTitle />}
              theme={'gray'}
              onPress={(): void => {
                Alert.alert('Comming Soon')
              }}
            />
          </View>
        </Body>
      )}
    </>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  theme: 'blue',
})

export default Screen

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
})
