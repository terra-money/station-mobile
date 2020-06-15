import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { DisplayCoin } from '@terra-money/use-native-station'
import Number from './Number'

interface Props {
  attrs: {}
  label: string
  display: DisplayCoin
}

const MaxButton = ({ attrs, label, display }: Props) => (
  <>
    <Text>{label}: </Text>
    <TouchableOpacity {...attrs}>
      <Number>{display.value}</Number>
    </TouchableOpacity>
  </>
)

export default MaxButton
