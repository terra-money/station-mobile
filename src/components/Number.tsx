import React, { FC } from 'react'
import { Text } from 'react-native'
import { format, DisplayCoin } from '@terra-money/use-native-station'

interface Props extends Partial<DisplayCoin> {
  children?: string

  /* config */
  fontSize?: number
  estimated?: boolean
  integer?: boolean
}

const Number: FC<Props> = ({ value, unit, children, ...config }) => {
  const { estimated, integer: hideDecimal, fontSize } = config
  const number = value ?? children ?? format.amount('0')
  const [integer, decimal] = number.split('.')

  return (
    <Text style={{ fontSize }}>
      {estimated && '≈ '}
      {integer}

      <Text>
        {!hideDecimal && `.${decimal}`}
        {unit && ` ${unit}`}
      </Text>
    </Text>
  )
}

export default Number
