import { useNavigation } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import { StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import color from 'styles/color'
import {
  StackHeaderLeftButtonProps,
  StackNavigationOptions,
} from '@react-navigation/stack'

type HeaderTheme = 'blue' | 'white'

export type HeaderProps = {
  theme?: HeaderTheme
  goBackIconType?: 'arrow' | 'close'
  headerLeft?: (props: StackHeaderLeftButtonProps) => React.ReactNode
  headerRight?: (props: {
    tintColor?: string | undefined
  }) => React.ReactNode
}

const HeaderLeft = ({
  theme,
  goBackIconType,
}: {
  theme?: HeaderTheme
  goBackIconType?: 'arrow' | 'close'
}): ReactElement => {
  const { goBack } = useNavigation()

  return (
    <TouchableOpacity onPress={goBack}>
      <MaterialIcons
        name={
          goBackIconType === 'close' ? 'clear' : 'keyboard-arrow-left'
        }
        color={theme === 'blue' ? color.white : color.sapphire}
        size={32}
      />
    </TouchableOpacity>
  )
}

export const navigationHeaderOptions = (
  props: HeaderProps
): StackNavigationOptions => {
  const { theme, goBackIconType, headerRight } = props
  const containerStyle: StyleProp<ViewStyle> = {}
  switch (theme) {
    case 'blue':
      containerStyle.backgroundColor = color.sapphire
      break
    case 'white':
    default:
      containerStyle.backgroundColor = color.white
      break
  }
  return {
    headerStyle: { ...styles.container, ...containerStyle },
    headerLeftContainerStyle: { paddingLeft: 20 },
    headerLeft: (): ReactElement => (
      <HeaderLeft {...{ theme, goBackIconType }} />
    ),
    headerTitle: '',
    headerRightContainerStyle: { paddingRight: 20 },
    headerRight,
  }
}

export const styles = StyleSheet.create({
  container: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
})
