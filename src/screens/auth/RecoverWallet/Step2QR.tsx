import React, { useState, ReactElement, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { useRecoilState, useSetRecoilState } from 'recoil'
import {
  CommonActions,
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
import { RecoverWalletStackParams, AuthStackParams } from 'types'
import {
  StackNavigationOptions,
  StackScreenProps,
} from '@react-navigation/stack'
import { jsonTryParse } from 'utils/util'
import { useAlert } from 'hooks/useAlert'
import LinkingStore, {
  AuthLinkingScreenKeyEnum,
  MainLinkingScreenKeyEnum,
} from 'stores/LinkingStore'

type Props = StackScreenProps<RecoverWalletStackParams, 'Step2QR'>

const Screen = ({ route }: Props): ReactElement => {
  const payload = route.params?.payload

  const { dispatch, navigate } = useNavigation<
    NavigationProp<AuthStackParams>
  >()
  const { openIsUseBioAuth } = useBioAuth()

  const [qrData, setQrData] = useRecoilState(
    RecoverWalletStore.qrData
  )
  const { alert } = useAlert()

  const setAuthLinkingScreenKeys = useSetRecoilState(
    LinkingStore.authLinkingScreenKeys
  )
  const setMainLinkingScreenKeys = useSetRecoilState(
    LinkingStore.mainLinkingScreenKeys
  )
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
      const key = decryptKey(qrData.encrypted_key, password)
      if (key) {
        const wallet = {
          address: qrData.address,
          name,
        }

        await addWallet({
          wallet,
          key: qrData.encrypted_key,
          password,
        })
        if (
          false === (await getIsUseBioAuth()) &&
          (await isSupportedBiometricAuthentication())
        ) {
          openIsUseBioAuth()
        }
        dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: 'WalletRecovered', params: { wallet } }],
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

  useEffect(() => {
    if (payload) {
      setAuthLinkingScreenKeys(
        (oriList): AuthLinkingScreenKeyEnum[] => {
          return _.clone(oriList).filter(
            (x) => x !== AuthLinkingScreenKeyEnum.RecoverWallet
          )
        }
      )
      setMainLinkingScreenKeys(
        (oriList): MainLinkingScreenKeyEnum[] => {
          return _.clone(oriList).filter(
            (x) => x !== MainLinkingScreenKeyEnum.AutoLogout
          )
        }
      )
      const bufferString = Buffer.from(payload, 'base64').toString()
      const data = jsonTryParse<RecoverWalletQrCodeDataType>(
        bufferString
      )

      if (
        data &&
        typeof data === 'object' &&
        'address' in data &&
        'name' in data &&
        'encrypted_key' in data
      ) {
        setName(data.name)
        setQrData(data)
      } else {
        alert({ desc: 'Wrong QR Code' })
        navigate('AuthMenu')
      }
    }
    return (): void => {
      setinputName('')
      setNameErrMsg('')
    }
  }, [])

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

Screen.navigationOptions = ({
  route,
}: Props): StackNavigationOptions => {
  const payload = route.params?.payload
  return navigationHeaderOptions({
    theme: 'sapphire',
    headerRight: HeaderRight,
    headerLeft: payload ? (): ReactElement => <View /> : undefined,
  })
}

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
