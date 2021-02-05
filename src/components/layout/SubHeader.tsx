import React, { ReactElement } from 'react'
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableWithoutFeedback,
  Keyboard, // It's for keyboard.dismiss. not works with getgure-handler's
} from 'react-native'

import { Text } from 'components'
import color from 'styles/color'
import StatusBar from 'components/StatusBar'

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
    <>
      <StatusBar theme={theme} />
      <TouchableWithoutFeedback // It must be from react-native, not gesture-handler's
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <View style={[styles.headerBottomTitleBox, containerStyle]}>
          <Text
            style={[styles.headerBottomTitle, textStyle]}
            fontType={'bold'}
          >
            {title}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </>
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
