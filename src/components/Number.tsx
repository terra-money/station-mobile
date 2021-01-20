import React, { FC } from 'react'
import { StyleProp, StyleSheet, TextStyle } from 'react-native'
import { format, DisplayCoin } from 'use-station/src'

import Text from 'components/Text'
import color from 'styles/color'

interface Props extends Partial<DisplayCoin> {
  children?: string

  /* config */
  numberFontStyle?: StyleProp<TextStyle>
  decimalFontStyle?: StyleProp<TextStyle>
  estimated?: boolean
  integer?: boolean
  dark?: boolean
}

const Number: FC<Props> = ({ value, unit, children, ...config }) => {
  const {
    estimated,
    integer: hideDecimal,
    numberFontStyle,
    decimalFontStyle,
  } = config

  const number = value ?? children ?? format.amount('0')
  const [integer, decimal] = number.split('.')

  return (
    <Text style={[styles.number, numberFontStyle]}>
      {estimated && '≈ '}
      {integer}

      <Text
        style={[styles.decimal, decimalFontStyle || numberFontStyle]}
      >
        {!hideDecimal && `.${decimal}`}
        {unit && ` ${unit}`}
      </Text>
    </Text>
  )
}

/* styles */
const styles = StyleSheet.create({
  number: {
    fontSize: 24,
    color: color.sapphire,
  },
  decimal: {
    fontSize: 18,
    color: color.sapphire,
  },
})
export default Number
