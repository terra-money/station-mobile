import React, { FC } from 'react'
import { StyleProp, StyleSheet, TextStyle } from 'react-native'
import { format, DisplayCoin } from 'lib'

import { COLOR } from 'consts'

import Text from './Text'

interface Props extends Partial<DisplayCoin> {
  children?: string

  /* config */
  numberFontStyle?: StyleProp<TextStyle>
  decimalFontStyle?: StyleProp<TextStyle>
  estimated?: boolean
  integer?: boolean
  fontType?: 'light' | 'book' | 'medium' | 'bold'
}

const Number: FC<Props> = ({ value, unit, children, ...config }) => {
  const {
    fontType,
    estimated,
    integer: hideDecimal,
    numberFontStyle,
    decimalFontStyle,
  } = config

  const number = value ?? children ?? format.amount('0')
  const [integer, decimal] = number.split('.')

  return (
    <Text
      style={[styles.number, numberFontStyle]}
      fontType={fontType}
    >
      {estimated && '≈ '}
      {integer}

      <Text
        style={[styles.decimal, decimalFontStyle || numberFontStyle]}
        fontType={fontType}
      >
        {!hideDecimal && decimal && `.${decimal}`}
        {unit && ` ${unit}`}
      </Text>
    </Text>
  )
}

/* styles */
const styles = StyleSheet.create({
  number: {
    fontSize: 16,
    color: COLOR.primary._02,
    textAlign: 'right',
    flexShrink: 1,
  },
  decimal: {
    fontSize: 12,
    color: COLOR.primary._02,
  },
})
export default Number
