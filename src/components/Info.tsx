import React, { FC, ReactNode } from 'react'

import _ from 'lodash'
import { Card as CardProps } from 'use-station/src'
import Icon from './Icon'
import Card from './Card'
import Text from './Text'

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
      {typeof icon === 'string' ? <Icon name={icon} size={50} color="#2043B5" style={{ alignSelf: 'center' }} /> : icon}
      {_.some(title) && (
        <Text style={{ textAlign: 'center', marginTop: 3, fontSize: 17, lineHeight: 24 }} fontType="bold">{title}</Text>
      )}
      <Text style={{ textAlign: 'center', marginTop: 3, fontSize: 14, lineHeight: 21 }}>
        {content ?? children}
      </Text>
    </>
  )

  return card ? <Card style={{ marginHorizontal: 0 }}>{inner}</Card> : inner
}

export default Info
