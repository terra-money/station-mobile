import React, { FC } from 'react'
import Text from 'components/Text'

const ExtLink: FC<{ href: string }> = ({ href, children }) =>
  href ? <Text>{children}</Text> : <Text>{children}</Text>

export default ExtLink
