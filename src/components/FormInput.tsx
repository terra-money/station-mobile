import React, { ReactElement } from 'react'
import { StyleSheet, TextInputProps, View } from 'react-native'
import _ from 'lodash'

import { Text, Icon } from 'components'
import Input from './Input'
import color from 'styles/color'

export type FormInputProps = {
  errorMessage?: string
} & TextInputProps

const FormInput = (props: FormInputProps): ReactElement => {
  const { errorMessage, ...rest } = props

  const inputContainerStyle = _.some(errorMessage)
    ? {
        borderColor: color.red,
        marginBottom: 5,
      }
    : {}

  return (
    <>
      <Input style={inputContainerStyle} {...rest} />
      {_.some(errorMessage) && (
        <View style={styles.errorMessageBox}>
          <Icon name={'info'} color={color.red} size={12} />
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
    color: color.red,
    fontSize: 10,
    paddingLeft: 5,
  },
})
