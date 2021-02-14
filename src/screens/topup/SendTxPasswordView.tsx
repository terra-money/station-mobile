import React, { ReactElement, useState } from 'react'
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  StyleSheet,
  Keyboard,
} from 'react-native'
import SubHeader from 'components/layout/SubHeader'
import color from 'styles/color'
import font from 'styles/font'
import { Button, FormInput, Icon, Text } from 'components'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParams } from 'types'
import StatusBar from 'components/StatusBar'
import { useNavigation } from '@react-navigation/native'
import useSignedTx from 'hooks/useSignedTx'

type Props = StackScreenProps<RootStackParams, 'SendTxPasswordView'>

const SendTxPasswordView = (props: Props): ReactElement => {
  const insets = useSafeAreaInsets()
  const { goBack } = useNavigation()
  const { confirm } = useSignedTx(props.route.params.endpointAddress)

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
              backgroundColor: color.sapphire,
            }}
          />
          <View style={style.headerContainer}>
            <TouchableOpacity onPress={goBack}>
              <Icon
                name={'arrow-back-ios'}
                color={color.white}
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
              placeholderTextColor={color.sapphire_op50}
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
    backgroundColor: color.sapphire,
    height: 60,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  contentContainer: { flex: 1, marginHorizontal: 20 },

  passwordText: {
    fontSize: 14,
    lineHeight: 21,
    color: color.sapphire,
    marginTop: 20,
    marginBottom: 5,
  },
  formInputText: {
    fontFamily: font.gotham.book,
  },

  buttonContainer: {
    flexDirection: 'column',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonTitle: { fontSize: 16, lineHeight: 24 },
})

export default SendTxPasswordView
