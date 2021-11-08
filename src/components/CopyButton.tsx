import React, { ReactElement, ReactNode } from 'react'
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import Clipboard from '@react-native-community/clipboard'

import Text from './Text'
import Icon from './Icon'

import { COLOR } from 'consts'
import useTopNoti from 'hooks/useTopNoti'

export type CopyButtonProps = {
  copyString: string
  theme?: 'sapphire' | 'white'
  containerStyle?: StyleProp<ViewStyle>
  children?: ReactNode
  activeOpacity?: number
}

const CopyButton = (props: CopyButtonProps): ReactElement => {
  const { theme } = props
  const containerStyle: StyleProp<ViewStyle> = {}
  const textStyle: StyleProp<TextStyle> = {}
  const { showNoti } = useTopNoti()
  switch (theme) {
    case 'sapphire':
      containerStyle.borderColor = 'rgba(255,255,255,.5)'
      containerStyle.backgroundColor = COLOR.primary._02
      textStyle.color = COLOR.white
      break
    case 'white':
    default:
      containerStyle.borderColor = COLOR.primary._02
      containerStyle.backgroundColor = COLOR.white
      textStyle.color = COLOR.primary._02
      break
  }
  return (
    <TouchableOpacity
      onPress={(): void => {
        showNoti({ message: 'Copied' })
        Clipboard.setString(props.copyString)
      }}
      activeOpacity={props.activeOpacity}
    >
      {props.children ? (
        <View style={props.containerStyle}>{props.children}</View>
      ) : (
        <View
          style={[
            styles.copyButton,
            containerStyle,
            props.containerStyle,
          ]}
        >
          <Icon
            name={'content-paste'}
            color={
              theme === 'sapphire' ? COLOR.white : COLOR.primary._02
            }
          />
          <Text
            style={[{ fontSize: 10, marginLeft: 4 }, textStyle]}
            fontType="medium"
          >
            COPY
          </Text>
        </View>
      )}
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
