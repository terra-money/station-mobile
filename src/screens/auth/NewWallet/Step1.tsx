import React, { useState, ReactElement } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { useRecoilState } from 'recoil'

import Button from 'components/Button'
import FormInput from 'components/FormInput'

import color from 'styles/color'
import { useValueValidator } from 'hooks/useValueValidator'
import NewWalletStore from 'stores/NewWalletStore'
import Body from 'components/layout/Body'
import { useNavigation } from '@react-navigation/native'
import Header from 'components/layout/Header'

const Screen = (): ReactElement => {
  const [name, setName] = useRecoilState(NewWalletStore.name)

  const { navigate } = useNavigation()

  const { valueValidate } = useValueValidator()
  const [nameErrMsg, setNameErrMsg] = useState('')
  const [password, setPassword] = useRecoilState(
    NewWalletStore.password
  )
  const [passwordErrMsg, setPasswordErrMsg] = useState('')

  const [passwordConfirm, setPasswordConfirm] = useState('1234567890')
  const [passwordConfirmErrMsg, setPasswordConfirmErrMsg] = useState(
    ''
  )

  const stepConfirmed =
    _.isEmpty(
      nameErrMsg || passwordErrMsg || passwordConfirmErrMsg
    ) && _.some(name && password && passwordConfirm)

  const onChangeName = (text: string): void => {
    setName(text)
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
    navigate('NewWalletStep2')
  }

  return (
    <Body
      type={'sky'}
      containerStyle={{
        paddingBottom: 50,
        paddingTop: 20,
        justifyContent: 'space-between',
      }}
    >
      <View>
        <View style={styles.section}>
          <Text style={styles.title}>Wallet Name</Text>
          <FormInput
            underlineColorAndroid="#ccc"
            value={name}
            onChangeText={onChangeName}
            placeholder={'Enter 5-20 alphanumeric characters'}
            errorMessage={nameErrMsg}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Password</Text>
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
          <Text style={styles.title}>Confirm Password</Text>
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
        type={'blue'}
        containerStyle={{ marginBottom: 10 }}
        disabled={!stepConfirmed}
        onPress={onPressNext}
      />
    </Body>
  )
}

const HeaderRight = (): ReactElement => {
  return (
    <View>
      <Text>1</Text>
    </View>
  )
}

const header = (): ReactElement => (
  <Header
    type={'blue'}
    goBackIconType="close"
    headerBottom={'New Wallet'}
    headerRight={<HeaderRight />}
  />
)

Screen.header = header

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
