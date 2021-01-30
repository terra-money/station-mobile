import React, { ReactElement } from 'react'
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import color from 'styles/color'

type InputProps = {
  containerStyle: StyleProp<ViewStyle>
} & TextInputProps

const Input = (props: InputProps): ReactElement => {
  const { style, ...rest } = props
  const defaultStyle: StyleProp<TextStyle> = {
    borderRadius: 8,
    height: 45,
    backgroundColor:
      false === rest.editable ? '#ebeff8' : color.white,
    justifyContent: 'center',
    padding: 0,
    paddingLeft: 15,
  }
  return (
    <View
      style={[
        {
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#cfd8ea',
        },
        props.containerStyle,
      ]}
    >
      <TextInput
        style={[defaultStyle, style]}
        {...rest}
        underlineColorAndroid={'#ffffff00'}
      />
    </View>
  )
}

export default Input
