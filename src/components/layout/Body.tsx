import React, { ReactElement, ReactNode } from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import color from 'styles/color'

export type BodyProps = {
  type?: 'white' | 'gray' | 'blue'
  containerStyle?: StyleProp<ViewStyle>
  children: ReactNode
}

const Body = (props: BodyProps): ReactElement => {
  const { type } = props

  const containerStyle: StyleProp<ViewStyle> = {}

  switch (type) {
    case 'blue':
      containerStyle.backgroundColor = color.sapphire
      break
    case 'gray':
      containerStyle.backgroundColor = color.gray
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
      {props.children}
    </View>
  )
}

export default Body

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
})
