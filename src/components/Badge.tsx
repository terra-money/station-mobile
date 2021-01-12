import React, { FC } from 'react'
import { Text } from 'react-native'

interface Props {
  active?: boolean
  light?: boolean
  small?: boolean
}

const Badge: FC<Props> = ({ children }) => <Text>{children}</Text>

export default Badge
