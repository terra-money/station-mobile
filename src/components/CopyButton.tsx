import React, { ReactElement } from 'react'
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { Icon, Text } from 'components'

import color from 'styles/color'

export type CopyButtonProps = {
  copyString: string
  theme?: 'blue' | 'white'
}

const CopyButton = (props: CopyButtonProps): ReactElement => {
  const { theme } = props
  const containerStyle: StyleProp<ViewStyle> = {}
  const textStyle: StyleProp<TextStyle> = {}

  switch (theme) {
    case 'blue':
      containerStyle.borderColor = color.white
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
      style={[styles.copyButton, containerStyle]}
    >
      <Icon
        name={'description'}
        color={theme === 'blue' ? color.white : color.sapphire}
      />
      <Text style={[{ fontSize: 10 }, textStyle]}>COPY</Text>
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
