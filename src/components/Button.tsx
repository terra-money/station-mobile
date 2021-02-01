import React, { ReactElement } from 'react'
import {
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
  GestureResponderEvent,
  TouchableOpacity,
} from 'react-native'

import color from 'styles/color'
import Text from './Text'

export type ButtonProps = {
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
  const { theme, disabled } = props
  const titleStyle: StyleProp<TextStyle> = { fontSize: 16 }
  const containerStyle: StyleProp<ViewStyle> = {}

  switch (theme) {
    case 'sapphire':
      titleStyle.color = color.white
      containerStyle.backgroundColor = color.sapphire
      containerStyle.borderColor = color.sapphire
      break
    case 'dodgerBlue':
      titleStyle.color = color.white
      containerStyle.backgroundColor = color.dodgerBlue
      containerStyle.borderColor = color.dodgerBlue
      break
    case 'red':
      titleStyle.color = color.white
      containerStyle.backgroundColor = color.red
      containerStyle.borderColor = color.red
      break
    case 'gray':
      titleStyle.color = color.sapphire
      containerStyle.backgroundColor = color.gray
      containerStyle.borderColor = color.gray
      break
    case 'transparent':
      titleStyle.color = color.white
      containerStyle.backgroundColor = '#ffffff1a'
      containerStyle.borderColor = '#ffffff1a'
      break
    case 'white':
    default:
      titleStyle.color = color.sapphire
      containerStyle.backgroundColor = color.white
      containerStyle.borderColor = color.white
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
    borderWidth: 1,
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
