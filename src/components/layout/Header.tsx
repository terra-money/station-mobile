import { StackActions, useNavigation } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native'
import { Icon } from 'components'

import color from 'styles/color'
import {
  StackHeaderLeftButtonProps,
  StackHeaderTitleProps,
  StackNavigationOptions,
} from '@react-navigation/stack'
import { useAuth } from 'lib'

type HeaderTheme = 'white' | 'sky' | 'sapphire'

export type HeaderProps = {
  theme?: HeaderTheme
  goBackIconType?: 'arrow' | 'close'
  headerStyle?: StyleProp<ViewStyle>
  headerLeft?: (props: StackHeaderLeftButtonProps) => React.ReactNode
  headerTitle?:
    | string
    | ((props: StackHeaderTitleProps) => React.ReactNode)
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
  const { user } = useAuth()
  const { goBack, canGoBack, dispatch } = useNavigation()

  const onPressGoBack = (): void => {
    if (canGoBack()) {
      goBack()
    } else {
      dispatch(StackActions.replace(user ? 'Tabs' : 'AuthMenu'))
    }
  }

  return (
    <TouchableOpacity
      onPress={onPressGoBack}
      style={{ paddingLeft: 20 }}
    >
      <Icon
        name={goBackIconType === 'close' ? 'close' : 'arrow-back-ios'}
        color={theme === 'sapphire' ? color.white : color.sapphire}
        size={goBackIconType === 'close' ? 28 : 24}
      />
    </TouchableOpacity>
  )
}

export const navigationHeaderOptions = (
  props: HeaderProps & StackNavigationOptions
): StackNavigationOptions => {
  const {
    theme,
    goBackIconType,
    headerLeft,
    headerTitle,
    headerRight,
    headerStyle,
  } = props
  const containerStyle: StyleProp<ViewStyle> = {}
  switch (theme) {
    case 'sapphire':
      containerStyle.backgroundColor = color.sapphire
      break
    case 'sky':
      containerStyle.backgroundColor = color.sky
      break
    case 'white':
    default:
      containerStyle.backgroundColor = color.white
      break
  }
  return {
    headerStyle: [
      {
        ...styles.container,
        ...containerStyle,
      },
      headerStyle,
    ],
    headerLeft:
      headerLeft ||
      ((): ReactElement => (
        <HeaderLeft {...{ theme, goBackIconType }} />
      )),
    headerTitle: headerTitle || '',
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
