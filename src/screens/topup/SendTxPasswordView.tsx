import React, { ReactElement, useState } from 'react'
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  StyleSheet,
  Keyboard,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'

import { COLOR, FONT } from 'consts'

import SubHeader from 'components/layout/SubHeader'

import { Button, FormInput, Icon, Text } from 'components'
import { RootStackParams } from 'types'
import StatusBar from 'components/StatusBar'
import useSignedTx from 'hooks/useSignedTx'

type Props = StackScreenProps<RootStackParams, 'SendTxPasswordView'>

const SendTxPasswordView = (props: Props): ReactElement => {
  const insets = useSafeAreaInsets()
  const { goBack } = useNavigation()
  const { confirm } = useSignedTx(
    props.route.params.endpointAddress,
    props.navigation
  )

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const confirmSignedTx = async (): Promise<void> => {
    setError('')
    const result = await confirm(
      password,
      props.route.params.returnScheme
    )
    if ('content' in result) {
      setError('Incorrect Password')
    }
  }

  return (
    <>
      <StatusBar theme="sapphire" />
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <View
          style={[
            style.container,
            {
              marginBottom: insets.bottom,
            },
          ]}
        >
          <View
            style={{
              height: insets.top,
              backgroundColor: COLOR.primary._02,
            }}
          />
          <View style={style.headerContainer}>
            <TouchableOpacity onPress={goBack}>
              <Icon
                name={'arrow-back-ios'}
                color={COLOR.white}
                size={24}
              />
            </TouchableOpacity>
          </View>
          <SubHeader theme="sapphire" title="Enter password" />
          <View style={style.contentContainer}>
            <Text fontType="medium" style={style.passwordText}>
              {'Password'}
            </Text>
            <FormInput
              style={style.formInputText}
              placeholderTextColor={COLOR.primary._02_op50}
              placeholder={'Must be at least 10 characters'}
              secureTextEntry={true}
              onChangeText={(text): void => {
                setPassword(text)
                setError('')
              }}
              errorMessage={error}
              value={password}
            />
          </View>
          <View style={style.buttonContainer}>
            <Button
              theme="sapphire"
              title="Send"
              titleStyle={style.buttonTitle}
              titleFontType="medium"
              onPress={(): void => {
                confirmSignedTx()
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  headerContainer: {
    backgroundColor: COLOR.primary._02,
    height: 60,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  contentContainer: { flex: 1, marginHorizontal: 20 },

  passwordText: {
    fontSize: 14,
    lineHeight: 21,
    color: COLOR.primary._02,
    marginTop: 20,
    marginBottom: 5,
  },
  formInputText: {
    fontFamily: FONT.gotham.book,
  },

  buttonContainer: {
    flexDirection: 'column',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonTitle: { fontSize: 16, lineHeight: 24 },
})

export default SendTxPasswordView
