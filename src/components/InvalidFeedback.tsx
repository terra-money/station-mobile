import React from 'react'
import { Text } from 'react-native'
import Icon from './Icon'

type Props = { tooltip?: boolean; children: string }
const InvalidFeedback = ({ children }: Props) =>
  children ? (
    <>
      <Icon name="error" />
      <Text>{children}</Text>
    </>
  ) : null

export default InvalidFeedback
