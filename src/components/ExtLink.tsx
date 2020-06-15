import React, { FC } from 'react'
import { Text } from 'react-native'

const ExtLink: FC<{ href: string }> = ({ href, children }) =>
  href ? <Text>{children}</Text> : <Text>{children}</Text>

export default ExtLink

/* helper */
const fix = (href: string): string => {
  try {
    new URL(href!)
    return href ?? ''
  } catch (error) {
    return href ? `https://${href}` : ''
  }
}
