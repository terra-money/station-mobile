import React, { FC } from 'react'
import { useInfo } from '@terra-money/use-native-station'
import Info from './Info'

const ErrorComponent: FC<{ card?: boolean }> = ({ card, children }) => {
  const { ERROR } = useInfo()
  const props = { icon: '"sentiment-very-dissatisfied"', card }

  return children ? (
    <Info {...props}>{children}</Info>
  ) : (
    <Info {...ERROR} {...props} />
  )
}

export default ErrorComponent
