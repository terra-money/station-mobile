import React, { ReactElement } from 'react'
import {
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import color from 'styles/color'

export type ButtonProps = {
  onPress?: (event: GestureResponderEvent) => void
  containerStyle?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  title: string
  type?: 'blue' | 'red' | 'gray' | 'white' | 'transparent'
}

const Button = (props: ButtonProps): ReactElement => {
  const { type } = props
  const titleStyle: StyleProp<TextStyle> = {}
  const containerStyle: StyleProp<ViewStyle> = {}

  switch (type) {
    case 'blue':
      titleStyle.color = color.white
      containerStyle.backgroundColor = color.sapphire
      containerStyle.borderColor = color.sapphire
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

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.container, containerStyle, props.containerStyle]}
    >
      <Text style={[titleStyle, props.titleStyle]}>
        {props.title}
      </Text>
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
