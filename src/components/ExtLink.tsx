import React, { ReactElement } from 'react'

import {
  Linking,
  StyleProp,
  TextStyle,
  TouchableOpacity,
} from 'react-native'

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
  const onPress = (): void => {
    Linking.openURL(url)
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
