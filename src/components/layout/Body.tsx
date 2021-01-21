import React, { ReactElement, ReactNode } from 'react'
import { View, StyleProp, ViewStyle, ScrollView } from 'react-native'
import color from 'styles/color'

export type BodyProps = {
  theme?: 'white' | 'sky' | 'blue'
  containerStyle?: StyleProp<ViewStyle>
  children: ReactNode
  scrollable?: boolean
}

const Body = (props: BodyProps): ReactElement => {
  const { theme } = props

  const containerStyle: StyleProp<ViewStyle> = {
    paddingHorizontal: 20,
  }

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

  return (
    <>
      {props.scrollable ? (
        <ScrollView
          contentContainerStyle={[
            containerStyle,
            props.containerStyle,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {props.children}
        </ScrollView>
      ) : (
        <View
          style={[containerStyle, { flex: 1 }, props.containerStyle]}
        >
          {props.children}
        </View>
      )}
    </>
  )
}

export default Body
