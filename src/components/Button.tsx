import React, { ReactElement } from 'react'
import {
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
  GestureResponderEvent,
  TouchableOpacity,
} from 'react-native'

import { COLOR } from 'consts'
import Text from './Text'

export type ButtonProps = {
  size?: 'sm' | 'md'
  onPress?: (event: GestureResponderEvent) => void
  containerStyle?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  titleFontType?: 'light' | 'book' | 'medium' | 'bold'
  title: string | ReactElement
  theme?:
    | 'sapphire'
    | 'dodgerBlue'
    | 'red'
    | 'gray'
    | 'white'
    | 'transparent'
  disabled?: boolean
}

const Button = (props: ButtonProps): ReactElement => {
  const { theme, disabled, size } = props
  const titleStyle: StyleProp<TextStyle> = {
    fontSize: size === 'sm' ? 14 : 16,
  }
  const containerStyle: StyleProp<ViewStyle> = {
    height: size === 'sm' ? 40 : 60,
  }

  switch (theme) {
    case 'sapphire':
      titleStyle.color = COLOR.white
      containerStyle.backgroundColor = COLOR.primary._02
      containerStyle.borderColor = COLOR.primary._02
      break
    case 'dodgerBlue':
      titleStyle.color = COLOR.white
      containerStyle.backgroundColor = COLOR.primary._03
      containerStyle.borderColor = COLOR.primary._03
      break
    case 'red':
      titleStyle.color = COLOR.white
      containerStyle.backgroundColor = COLOR.red
      containerStyle.borderColor = COLOR.red
      break
    case 'gray':
      titleStyle.color = COLOR.primary._02
      containerStyle.backgroundColor = COLOR.gray
      containerStyle.borderColor = COLOR.gray
      break
    case 'transparent':
      titleStyle.color = COLOR.white
      containerStyle.backgroundColor = '#ffffff1a'
      containerStyle.borderColor = '#ffffff1a'
      break
    case 'white':
    default:
      titleStyle.color = COLOR.primary._02
      containerStyle.backgroundColor = COLOR.white
      containerStyle.borderColor = COLOR.white
      break
  }

  containerStyle.opacity = disabled ? 0.3 : 1

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.container, containerStyle, props.containerStyle]}
      disabled={disabled}
    >
      {typeof props.title === 'string' ? (
        <Text
          style={[titleStyle, props.titleStyle]}
          fontType={props.titleFontType || 'medium'}
        >
          {props.title}
        </Text>
      ) : (
        props.title
      )}
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
