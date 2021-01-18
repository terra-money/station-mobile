import React, { FC, ReactNode } from 'react'

import _ from 'lodash'
import { Card as CardProps } from '@terra-money/use-native-station'
import Icon from './Icon'
import Card from './Card'
import Text from 'components/Text'

interface Props extends CardProps {
  icon?: string | ReactNode
  card?: boolean
}

const Info: FC<Props> = ({
  icon,
  title,
  content,
  children,
  card,
}) => {
  const inner = (
    <>
      {typeof icon === 'string' ? <Icon name={icon} /> : icon}
      {_.some(title) && <Text>{title}</Text>}
      <Text>{content ?? children}</Text>
    </>
  )

  return card ? <Card>{inner}</Card> : inner
}

export default Info
