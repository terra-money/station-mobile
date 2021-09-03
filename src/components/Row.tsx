import React, { ReactElement, ReactNode } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

const Row = ({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>
  children: ReactNode
}): ReactElement => {
  return (
    <View style={[{ flexDirection: 'row' }, style]}>{children}</View>
  )
}

export default Row
