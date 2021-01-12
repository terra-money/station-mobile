import React, { FC } from 'react'
import { Text } from 'react-native'
import { format, DisplayCoin } from '@terra-money/use-native-station'
import EStyleSheet from 'react-native-extended-stylesheet'

interface Props extends Partial<DisplayCoin> {
  children?: string

  /* config */
  fontSize?: number
  estimated?: boolean
  integer?: boolean
  dark?: boolean
}

const Number: FC<Props> = ({
  value,
  unit,
  children,
  dark,
  ...config
}) => {
  const { estimated, integer: hideDecimal } = config
  const number = value ?? children ?? format.amount('0')
  const [integer, decimal] = number.split('.')
  const textColor = [lightStyles.text, dark && darkStyles.text]
  const textSize = [lightStyles.value, dark && darkStyles.value]

  return (
    <Text style={[textSize, textColor]}>
      {estimated && '≈ '}
      {integer}

      <Text style={styles.unit}>
        {!hideDecimal && `.${decimal}`}
        {unit && ` ${unit}`}
      </Text>
    </Text>
  )
}

/* styles */
const styles = EStyleSheet.create({
  unit: {
    fontSize: 18,
    letterSpacing: 0,
  },
})

const lightStyles = EStyleSheet.create({
  text: { color: '$primaryColor' },
  value: {
    fontFamily: 'TerraCompact-Regular',
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
})

const darkStyles = EStyleSheet.create({
  text: { color: 'white' },
  value: {
    fontFamily: 'TerraCompact-Regular',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.5,
    marginTop: 10,
  },
})

export default Number
