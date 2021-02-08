import React, { useState, ReactElement, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  StackActions,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import Button from 'components/Button'
import FormInput from 'components/FormInput'
import { useValueValidator } from 'hooks/useValueValidator'
import RecoverWalletStore from 'stores/RecoverWalletStore'
import NumberStep from 'components/NumberStep'
import FormLabel from 'components/FormLabel'
import { decryptKey, addWallet } from 'utils/wallet'
import { getIsUseBioAuth } from 'utils/storage'
import { isSupportedBiometricAuthentication } from 'utils/bio'
import { useBioAuth } from 'hooks/useBioAuth'
import { RecoverWalletStackParams } from 'types'

const Screen = (): ReactElement => {
  const { dispatch } = useNavigation<
    NavigationProp<RecoverWalletStackParams>
  >()
  const { openIsUseBioAuth } = useBioAuth()

  const qrData = useRecoilValue(RecoverWalletStore.qrData)
  const [name, setName] = useRecoilState(RecoverWalletStore.name)
  const [inputName, setinputName] = useState(name)
  const [disableNextButton, setDisableNextButton] = useState(false)
  const { valueValidate, walletList } = useValueValidator()
  const [nameErrMsg, setNameErrMsg] = useState('')
  const [password, setPassword] = useRecoilState(
    RecoverWalletStore.password
  )
  const [passwordErrMsg, setPasswordErrMsg] = useState('')

  const stepConfirmed =
    _.isEmpty(nameErrMsg || passwordErrMsg) &&
    _.some(name && password)

  const onChangeName = (text: string): void => {
    setName(text)
    setinputName(text)
    setNameErrMsg(valueValidate.name(text))
  }

  const onChangePassword = (text: string): void => {
    setPassword(text)
    setPasswordErrMsg('')
  }

  const onPressNext = async (): Promise<void> => {
    const inputNameError = valueValidate.name(inputName)
    if (_.some(inputNameError)) {
      setNameErrMsg(inputNameError)
      return
    }
    setDisableNextButton(true)
    if (qrData) {
      const key = decryptKey(qrData.privateKey, password)
      if (key) {
        const wallet = {
          address: qrData.address,
          name,
        }

        await addWallet({
          wallet,
          key: qrData.privateKey,
          password,
        })
        if (
          false === (await getIsUseBioAuth()) &&
          (await isSupportedBiometricAuthentication())
        ) {
          openIsUseBioAuth()
        }
        dispatch(StackActions.popToTop())
        dispatch(
          StackActions.replace('WalletRecovered', {
            wallet,
          })
        )
      } else {
        setDisableNextButton(false)
        setPasswordErrMsg('Incorrect password')
      }
    }
  }

  useEffect(() => {
    if (name && _.isEmpty(inputName)) {
      setinputName(name)
    }
  }, [name])

  useEffect(() => {
    if (walletList.length > 0) {
      setNameErrMsg(valueValidate.name(inputName))
    }
  }, [walletList])

  return (
    <>
      <SubHeader theme={'sapphire'} title={'Set up your wallet'} />
      <Body theme={'sky'} containerStyle={styles.container}>
        <View>
          <View style={styles.section}>
            <FormLabel text={'Wallet name'} />
            <FormInput
              underlineColorAndroid="#ccc"
              value={inputName}
              onChangeText={onChangeName}
              placeholder={'Enter 5-20 alphanumeric characters'}
              errorMessage={nameErrMsg}
            />
          </View>
          <View style={styles.section}>
            <FormLabel text={'Password'} />
            <FormInput
              underlineColorAndroid="#ccc"
              value={password}
              secureTextEntry
              onChangeText={onChangePassword}
              placeholder={'Must be at least 10 characters'}
              errorMessage={passwordErrMsg}
            />
          </View>
        </View>

        <Button
          title="Next"
          theme={'sapphire'}
          containerStyle={{ marginBottom: 10 }}
          disabled={!stepConfirmed || disableNextButton}
          onPress={onPressNext}
        />
      </Body>
    </>
  )
}

const HeaderRight = (): ReactElement => (
  <NumberStep stepSize={2} nowStep={2} />
)

Screen.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
  headerRight: HeaderRight,
})

export default Screen

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  section: {
    marginBottom: 20,
  },
})
