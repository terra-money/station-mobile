import React, { ReactElement } from 'react'
import { StyleProp, TextStyle, TouchableOpacity } from 'react-native'

import useLinking from 'hooks/useLinking'
import Text from './Text'

const ExtLink = ({
  url,
  title,
  textStyle,
}: {
  url: string
  title: string | ReactElement
  textStyle?: StyleProp<TextStyle>
}): ReactElement => {
  const { openURL } = useLinking()

  const onPress = (): void => {
    openURL(url)
  }
  return (
    <TouchableOpacity onPress={onPress}>
      {typeof title === 'string' ? (
        <Text style={textStyle}>{title}</Text>
      ) : (
        title
      )}
    </TouchableOpacity>
  )
}

export default ExtLink
