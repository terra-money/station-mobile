import React, { useState, useEffect, ReactElement } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { useAuth } from 'use-station/src'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import _ from 'lodash'

import { getWallets, testPassword } from 'utils/wallet'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import {
  Button,
  Select,
  Input,
  FormLabel,
  BiometricButton,
} from 'components'

import { getIsUseBioAuth } from 'utils/storage'
import { RootStackParams } from 'types'

const Screen = (): ReactElement => {
  const [initPageComplete, setInitPageComplete] = useState(false)
  const [wallets, setWallets] = useState<LocalWallet[]>([])
  const [isUseBioAuth, setIsUseBioAuth] = useState(false)

  const { goBack } = useNavigation<NavigationProp<RootStackParams>>()

  const { signIn } = useAuth()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const onPressBiometricButton = ({
    isSuccess,
    password,
  }: {
    isSuccess: boolean
    password: string
  }): void => {
    if (isSuccess) {
      setPassword(password)
      submit({ password })
    }
  }

  const submit = async ({
    password,
  }: {
    password: string
  }): Promise<void> => {
    try {
      if ((await testPassword({ name, password })) === false)
        throw new Error('Wrong Password!')
      const wallet = wallets.find((w) => w.name === name)
      wallet && signIn(wallet)
      goBack()
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

    getIsUseBioAuth().then((isUse) => {
      setIsUseBioAuth(isUse)
    })
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
              theme={'sapphire'}
              onPress={(): Promise<void> => submit({ password })}
              containerStyle={{ marginBottom: 10 }}
            />
            {isUseBioAuth && (
              <View style={{ marginTop: 10 }}>
                <BiometricButton
                  walletName={name}
                  onPress={onPressBiometricButton}
                />
              </View>
            )}
          </View>
        </Body>
      )}
    </>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default Screen

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
})
