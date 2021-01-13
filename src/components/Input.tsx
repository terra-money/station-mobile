import React, { ReactElement } from 'react'
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
} from 'react-native'

import color from 'styles/color'

const Input = (props: TextInputProps): ReactElement => {
  const defaultStyle: StyleProp<TextStyle> = {
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cfd8ea',
    backgroundColor: color.white,
    justifyContent: 'center',
    paddingLeft: 15,
  }
  return <TextInput style={defaultStyle} {...props} />
}

export default Input
