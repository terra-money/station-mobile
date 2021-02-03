import React, { ReactElement } from 'react'
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import Text from './Text'
import Icon from './Icon'

import color from 'styles/color'

export type CopyButtonProps = {
  copyString: string
  theme?: 'sapphire' | 'white'
  containerStyle?: StyleProp<ViewStyle>
}

const CopyButton = (props: CopyButtonProps): ReactElement => {
  const { theme } = props
  const containerStyle: StyleProp<ViewStyle> = {}
  const textStyle: StyleProp<TextStyle> = {}

  switch (theme) {
    case 'sapphire':
      containerStyle.borderColor = 'rgba(255,255,255,.5)'
      containerStyle.backgroundColor = color.sapphire
      textStyle.color = color.white
      break
    case 'white':
    default:
      containerStyle.borderColor = color.sapphire
      containerStyle.backgroundColor = color.white
      textStyle.color = color.sapphire
      break
  }
  return (
    <TouchableOpacity
      onPress={(): void => {
        Clipboard.setString(props.copyString)
      }}
      style={[
        styles.copyButton,
        containerStyle,
        props.containerStyle,
      ]}
    >
      <Icon
        name={'content-paste'}
        color={theme === 'sapphire' ? color.white : color.sapphire}
      />
      <Text
        style={[{ fontSize: 10, marginLeft: 4 }, textStyle]}
        fontType="medium"
      >
        COPY
      </Text>
    </TouchableOpacity>
  )
}

export default CopyButton

const styles = StyleSheet.create({
  copyButton: {
    flexDirection: 'row',
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
})
