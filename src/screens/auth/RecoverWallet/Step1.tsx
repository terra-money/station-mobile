import React, { useState, ReactElement, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { useNavigation } from '@react-navigation/native'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import Button from 'components/Button'
import FormInput from 'components/FormInput'
import { useValueValidator } from 'hooks/useValueValidator'
import RecoverWalletStore from 'stores/RecoverWalletStore'
import NumberStep from 'components/NumberStep'
import FormLabel from 'components/FormLabel'

const Screen = (): ReactElement => {
  const { navigate } = useNavigation()
  const setSeed = useSetRecoilState(RecoverWalletStore.seed)
  const [name, setName] = useRecoilState(RecoverWalletStore.name)
  const [inputName, setinputName] = useState('')

  const { valueValidate } = useValueValidator()
  const [nameErrMsg, setNameErrMsg] = useState('')
  const [password, setPassword] = useRecoilState(
    RecoverWalletStore.password
  )
  const [passwordErrMsg, setPasswordErrMsg] = useState('')

  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordConfirmErrMsg, setPasswordConfirmErrMsg] = useState(
    ''
  )

  const stepConfirmed =
    _.isEmpty(
      nameErrMsg || passwordErrMsg || passwordConfirmErrMsg
    ) && _.some(name && password && passwordConfirm)

  const onChangeName = (text: string): void => {
    setName(text)
    setinputName(text)
    setNameErrMsg(valueValidate.name(text))
  }

  const onChangePassword = (text: string): void => {
    setPassword(text)
    setPasswordErrMsg(valueValidate.password(text))
    setPasswordConfirmErrMsg(
      text === passwordConfirm ? '' : 'Password does not match'
    )
  }

  const onChangePasswordConfirm = (text: string): void => {
    setPasswordConfirm(text)
    setPasswordConfirmErrMsg(
      text === password ? '' : 'Password does not match'
    )
  }

  const onPressNext = (): void => {
    navigate('RecoverWalletStep2')
  }

  useEffect(() => {
    setName('')
    setPassword('')
    setSeed([])
  }, [])

  return (
    <>
      <SubHeader
        theme={'sapphire'}
        title={'Recover Existing Wallet'}
      />
      <Body theme={'sky'} containerStyle={styles.container}>
        <View>
          <View style={styles.section}>
            <FormLabel text={'Wallet Name'} />
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
          <View style={styles.section}>
            <FormLabel text={'Confirm Password'} />
            <FormInput
              underlineColorAndroid="#ccc"
              value={passwordConfirm}
              secureTextEntry
              onChangeText={onChangePasswordConfirm}
              placeholder={'Confirm your password'}
              errorMessage={passwordConfirmErrMsg}
            />
          </View>
        </View>

        <Button
          title="Next"
          theme={'sapphire'}
          containerStyle={{ marginBottom: 10 }}
          disabled={!stepConfirmed}
          onPress={onPressNext}
        />
      </Body>
    </>
  )
}

const HeaderRight = (): ReactElement => (
  <NumberStep stepSize={3} nowStep={1} />
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
