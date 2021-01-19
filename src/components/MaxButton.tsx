import React, { ReactElement } from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { DisplayCoin } from 'use-station/src'
import Text from 'components/Text'
import Number from './Number'

interface Props {
  attrs: TouchableOpacityProps
  label: string
  display: DisplayCoin
}

const MaxButton = ({
  attrs,
  label,
  display,
}: Props): ReactElement => (
  <>
    <Text>{label}: </Text>
    <TouchableOpacity {...attrs}>
      <Number>{display.value}</Number>
    </TouchableOpacity>
  </>
)

export default MaxButton
