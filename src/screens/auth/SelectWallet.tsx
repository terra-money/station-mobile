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
import { Button, Select, Input, FormLabel } from 'components'

import {
  getBioAuthPassword,
  getIsUseBioAuth,
  settings,
} from 'utils/storage'
import { RootStackParams } from 'types'
import { useAlert } from 'hooks/useAlert'
import SubHeader from 'components/layout/SubHeader'
import TopupStore from 'stores/TopupStore'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { authenticateBiometric } from 'utils/bio'

const SelectWallet = (): ReactElement => {
  const { alert } = useAlert()
  const [initPageComplete, setInitPageComplete] = useState(false)
  const [wallets, setWallets] = useState<LocalWallet[]>([])
  const [isUseBioAuth, setIsUseBioAuth] = useState(false)

  const [connectAddress, setConnectAddress] = useRecoilState(
    TopupStore.connectAddress
  )
  const setContinueSignedTx = useSetRecoilState(
    TopupStore.continueSignedTx
  )

  const navigation = useNavigation<NavigationProp<RootStackParams>>()

  const { signIn } = useAuth()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const walletOption = wallets.map(({ name }) => ({
    label: name,
    value: name,
  }))

  const optionList =
    wallets.length === 1
      ? walletOption
      : [{ label: 'Select', value: '' }].concat(walletOption)

  const onPressBiometricButton = async ({
    walletName,
    wallets,
  }: {
    walletName: string
    wallets: LocalWallet[]
  }): Promise<void> => {
    const isSuccess = await authenticateBiometric()
    if (isSuccess) {
      const password = await getBioAuthPassword({
        walletName,
      })
      setPassword(password)
      submit({ walletName, password, wallets })
      return
    }
  }

  const submit = async ({
    walletName,
    password,
    wallets,
  }: {
    walletName: string
    password: string
    wallets: LocalWallet[]
  }): Promise<void> => {
    const result = await testPassword({ name: walletName, password })

    if (result.isSuccess) {
      const wallet = wallets.find((w) => w.name === walletName)

      if (wallet) {
        signIn(wallet)
        settings.set({ walletName })
        if (connectAddress) {
          setConnectAddress(undefined)
          setContinueSignedTx(true)
        }
      }
    } else {
      alert({ desc: result.errorMessage })
    }
  }

  const initPage = async (): Promise<void> => {
    const wallets = await getWallets()
    if (_.some(wallets)) {
      setWallets(wallets)
      if (wallets.length === 1) {
        setName(wallets[0].name)
      }
      setInitPageComplete(true)
    } else {
      alert({ desc: 'No Wallets' })
      navigation.goBack()
    }

    getIsUseBioAuth().then((isUse) => {
      setIsUseBioAuth(isUse)
      if (isUse && wallets?.length === 1) {
        onPressBiometricButton({
          wallets,
          walletName: wallets[0].name,
        })
      }
    })
  }

  useEffect(() => {
    initPage()

    const unsubscribe = navigation.addListener('blur', () =>
      setConnectAddress(undefined)
    )
    return unsubscribe
  }, [])

  useEffect(() => {
    const connectWallet = wallets.find(
      (wallet) => wallet.address === connectAddress
    )
    if (connectWallet) {
      setName(connectWallet?.name)
      getIsUseBioAuth().then((isUse) => {
        if (isUse) {
          onPressBiometricButton({
            wallets,
            walletName: connectWallet?.name,
          })
        }
      })
    }
  }, [wallets])

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
                  optionList={optionList}
                  onValueChange={(itemValue): void => {
                    setName(`${itemValue}`)
                    if (isUseBioAuth && itemValue) {
                      onPressBiometricButton({
                        wallets,
                        walletName: itemValue.toString(),
                      })
                    }
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
                disabled={_.isEmpty(name)}
                title="Next"
                theme={'sapphire'}
                onPress={(): Promise<void> =>
                  submit({ wallets, walletName: name, password })
                }
                containerStyle={{ marginBottom: 10 }}
              />
            </View>
          </Body>
        </>
      )}
    </>
  )
}

SelectWallet.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default SelectWallet

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
})
