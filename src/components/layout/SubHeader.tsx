import React, { ReactElement } from 'react'
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'

import { Text } from 'components'
import color from 'styles/color'

type HeaderTheme = 'sapphire' | 'white'

export type SubHeaderProps = {
  theme?: HeaderTheme
  title: string
}

const SubHeader = ({
  theme,
  title,
}: SubHeaderProps): ReactElement => {
  const containerStyle: StyleProp<ViewStyle> = {}
  const textStyle: StyleProp<TextStyle> = {}
  switch (theme) {
    case 'sapphire':
      textStyle.color = color.white
      containerStyle.backgroundColor = color.sapphire
      break
    case 'white':
    default:
      textStyle.color = color.sapphire
      containerStyle.backgroundColor = color.white
      break
  }

  return (
    <View style={[styles.headerBottomTitleBox, containerStyle]}>
      <Text
        style={[styles.headerBottomTitle, textStyle]}
        fontType={'medium'}
      >
        {title}
      </Text>
    </View>
  )
}

export default SubHeader

export const styles = StyleSheet.create({
  headerBottomTitleBox: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerBottomTitle: {
    fontSize: 26,
    lineHeight: 39,
  },
})
