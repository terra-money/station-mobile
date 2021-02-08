import React, { useState, useEffect, ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
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

import { getIsUseBioAuth, settings } from 'utils/storage'
import { RootStackParams } from 'types'
import { useAlert } from 'hooks/useAlert'
import SubHeader from 'components/layout/SubHeader'

const Screen = (): ReactElement => {
  const { alert } = useAlert()
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
    const result = await testPassword({ name, password })

    if (result.isSuccess) {
      const wallet = wallets.find((w) => w.name === name)
      if (wallet) {
        signIn(wallet)
        settings.set({ walletName: wallet.name })
      }
    } else {
      alert({ desc: result.errorMessage })
    }
  }

  const initPage = async (): Promise<void> => {
    const wallets = await getWallets()
    if (_.some(wallets)) {
      setWallets(wallets)
      setName(wallets[0].name)
      setInitPageComplete(true)
    } else {
      alert({ desc: 'No Wallets' })
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
        <>
          <SubHeader theme={'sapphire'} title={'Select wallet'} />
          <Body
            theme={'sky'}
            containerStyle={{
              paddingBottom: 50,
              paddingTop: 20,
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
        </>
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
