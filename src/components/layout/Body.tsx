import React, { ReactElement, ReactNode } from 'react'
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ScrollView,
} from 'react-native'
import color from 'styles/color'

export type BodyProps = {
  theme?: 'white' | 'sky' | 'blue'
  containerStyle?: StyleProp<ViewStyle>
  children: ReactNode
  scrollable?: boolean
}

const Body = (props: BodyProps): ReactElement => {
  const { theme } = props

  const containerStyle: StyleProp<ViewStyle> = {}

  switch (theme) {
    case 'blue':
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

  const Component = props.scrollable ? ScrollView : View
  const ComponentStyle = props.scrollable
    ? {
        contentContainerStyle: [
          styles.container,
          containerStyle,
          props.containerStyle,
        ],
      }
    : {
        style: [
          styles.container,
          containerStyle,
          props.containerStyle,
        ],
      }

  return (
    <Component {...{ ...ComponentStyle }}>{props.children}</Component>
  )
}

export default Body

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
})
