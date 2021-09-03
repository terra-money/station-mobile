import React, { ReactElement } from 'react'
import { View, StyleSheet } from 'react-native'
import { FormUI } from 'lib'

import UseStationFormField from './UseStationFormField'

interface Props {
  form: FormUI
}
const Form = ({ form }: Props): ReactElement => {
  const { fields } = form

  return (
    <View style={styles.container}>
      {fields.map((field, index) => (
        <UseStationFormField key={`fields-${index}`} field={field} />
      ))}
    </View>
  )
}

export default Form

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
})
