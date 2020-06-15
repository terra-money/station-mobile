import React from 'react'
import { Text } from 'react-native'
import { StyleProp, TextStyle } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Options } from '@terra-money/use-native-station'
import { useApp } from '../hooks'

interface Props {
  value?: string
  onChange?: (value: string) => void
  options?: Options
  style?: StyleProp<TextStyle>
}

const Select = ({ value: current, onChange, options, style }: Props) => {
  const { drawer } = useApp()

  const submit = (value: string) => {
    onChange?.(value)
    drawer.close()
  }

  const picker = (
    <>
      {options?.map(({ value, children }) => (
        <TouchableOpacity onPress={() => submit(value)} key={value}>
          <Text>
            {children}
            {value === current && ' ✓'}
          </Text>
        </TouchableOpacity>
      ))}
    </>
  )

  const { children } = options?.find((o) => o.value === current) ?? {}

  return (
    <TouchableOpacity onPress={() => drawer.open(picker)}>
      <Text style={style}>{children}</Text>
    </TouchableOpacity>
  )
}

export default Select
