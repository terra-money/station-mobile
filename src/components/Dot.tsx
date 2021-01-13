import React, { ReactElement } from 'react'
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import color from 'styles/color'

const Dot = ({
  style,
}: {
  style?: StyleProp<ViewStyle>
}): ReactElement => {
  return <View style={[styles.con, style]} />
}

export default Dot

const styles = StyleSheet.create({
  con: {
    width: 6,
    height: 6,
    borderRadius: 50,
    backgroundColor: color.white,
  },
})
