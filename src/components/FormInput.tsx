import React, { ReactElement } from 'react'
import {
  StyleProp,
  StyleSheet,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native'
import _ from 'lodash'

import Text from './Text'
import Icon from './Icon'
import Input from './Input'
import { COLOR } from 'consts'

export type FormInputProps = {
  errorMessage?: string
  containerStyle?: StyleProp<ViewStyle>
} & TextInputProps

const FormInput = (props: FormInputProps): ReactElement => {
  const { errorMessage, containerStyle, ...rest } = props

  const inputContainerStyle = _.some(errorMessage)
    ? {
        borderColor: COLOR.red,
        marginBottom: 5,
      }
    : {}

  return (
    <>
      <Input
        containerStyle={[inputContainerStyle, containerStyle]}
        autoCorrect={false}
        {...rest}
      />
      {_.some(errorMessage) && (
        <View style={styles.errorMessageBox}>
          <Icon name={'info'} color={COLOR.red} size={12} />
          <Text style={styles.errorMessage} fontType={'medium'}>
            {errorMessage}
          </Text>
        </View>
      )}
    </>
  )
}

export default FormInput

const styles = StyleSheet.create({
  errorMessageBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  errorMessage: {
    color: COLOR.red,
    fontSize: 10,
    paddingLeft: 5,
  },
})
