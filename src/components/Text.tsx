import React, { ReactElement, ReactNode } from 'react'
import {
  StyleProp,
  StyleSheet,
  Text as DefaultText,
  TextProps as DefaultTextProps,
  TextStyle,
} from 'react-native'
import color from 'styles/color'

export type TextProps = {
  fontType?: 'light' | 'book' | 'medium' | 'bold'
  children?: ReactNode
} & DefaultTextProps

const Text = (props: TextProps): ReactElement => {
  const { style, fontType, ...rest } = props

  const fontStyle: StyleProp<TextStyle> = {}
  switch (fontType) {
    case 'light':
      fontStyle.fontFamily = 'Gotham-Light'
      break
    case 'medium':
      fontStyle.fontFamily = 'Gotham-Medium'
      break
    case 'bold':
      fontStyle.fontFamily = 'Gotham-Bold'
      break
    case 'book':
    default:
      fontStyle.fontFamily = 'Gotham-Book'
      break
  }

  return (
    // fontStyle must be after then style for the fontFamily,fontWeight
    <DefaultText style={[styles.font, style, fontStyle]} {...rest} />
  )
}

export default Text

const styles = StyleSheet.create({
  font: {
    color: color.sapphire,
    fontVariant: ['tabular-nums'],
  },
})
