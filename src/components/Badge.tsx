import React, { ReactElement } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Text } from 'components'

const Label = ({
  text,
  containerStyle,
}: {
  text: string
  containerStyle?: StyleProp<ViewStyle>
}): ReactElement => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.text} fontType={'medium'}>
        {text}
      </Text>
    </View>
  )
}

export default Label

const styles = StyleSheet.create({
  container: {
    borderRadius: 9.5,
    backgroundColor: '#5493f7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 5,
  },
  text: {
    fontSize: 10,
    letterSpacing: 0,
    color: '#ffffff',
  },
})
