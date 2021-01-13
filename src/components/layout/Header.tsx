import { useNavigation } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import color from 'styles/color'

export type HeaderProps = {
  type?: 'blue' | 'white'
  goBackIconType?: 'arrow' | 'close'
  containerStyle?: StyleProp<ViewStyle>
  headerLeft?: ReactElement
  headerTitle?: ReactElement
  headerRight?: ReactElement
}

const HeaderLeft = ({
  type,
  goBackIconType,
}: {
  type?: 'blue' | 'white'
  goBackIconType?: 'arrow' | 'close'
}): ReactElement => {
  const { goBack } = useNavigation()

  return (
    <TouchableOpacity onPress={goBack}>
      <MaterialIcons
        name={
          goBackIconType === 'close' ? 'clear' : 'keyboard-arrow-left'
        }
        color={type === 'blue' ? color.white : color.sapphire}
        size={32}
      />
    </TouchableOpacity>
  )
}

const Header = (props: HeaderProps): ReactElement => {
  const { type } = props

  const containerStyle: StyleProp<ViewStyle> = {}
  switch (type) {
    case 'blue':
      containerStyle.backgroundColor = color.sapphire
      break
    case 'white':
    default:
      containerStyle.backgroundColor = color.white
      break
  }
  return (
    <View
      style={[styles.container, containerStyle, props.containerStyle]}
    >
      {props.headerLeft || <HeaderLeft type={type} />}
      <View style={{ flex: 1 }}>{props.headerTitle}</View>
      {props.headerRight}
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
})
