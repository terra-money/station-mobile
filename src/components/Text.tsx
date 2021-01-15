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
      fontStyle.fontWeight = '300'
      break
    case 'medium':
      fontStyle.fontWeight = '500'
      break
    case 'bold':
      fontStyle.fontWeight = '700'
      break
    case 'book':
    default:
      fontStyle.fontWeight = '400'
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
