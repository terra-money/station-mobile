import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'

import Text from 'components/Text'

const Label = ({ text }: { text: string }): ReactElement => {
  return (
    <View style={styles.container}>
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
