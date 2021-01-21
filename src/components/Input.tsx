import React, { ReactElement } from 'react'
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
} from 'react-native'

import color from 'styles/color'

const Input = (props: TextInputProps): ReactElement => {
  const { style, ...rest } = props
  const defaultStyle: StyleProp<TextStyle> = {
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cfd8ea',
    backgroundColor:
      false === rest.editable ? '#ebeff8' : color.white,
    justifyContent: 'center',
    padding: 0,
    paddingLeft: 15,
  }
  return (
    <TextInput
      style={[defaultStyle, style]}
      {...rest}
      underlineColorAndroid={'#ffffff00'}
    />
  )
}

export default Input
