import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'

import { COLOR } from 'consts'

import Text from './Text'

const FormLabel = ({ text }: { text: string }): ReactElement => (
  <Text style={styles.formLabel} fontType={'medium'}>
    {text}
  </Text>
)

export default FormLabel

const styles = StyleSheet.create({
  formLabel: {
    color: COLOR.primary._02,
    fontSize: 14,
    marginBottom: 5,
  },
})
