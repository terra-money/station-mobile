import React, { Fragment, ReactElement } from 'react'
import { View, StyleSheet } from 'react-native'
import { Field, FormUI, DisplayCoin } from 'use-station/src'
import _ from 'lodash'

import Select, { OptionProps } from 'components/Select'
import DefaultFormInput from 'components/FormInput'
import Text from 'components/Text'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Number from './Number'
import FormLabel from './FormLabel'

type FieldButton = {
  label: string
  display: DisplayCoin
  attrs: { onClick: () => void }
}

interface Props {
  form: FormUI
}

const FormButton = ({
  button,
}: {
  button: FieldButton
}): ReactElement => {
  const { attrs, display, label } = button
  return (
    <TouchableOpacity
      style={styles.formButtonContainer}
      onPress={attrs.onClick}
    >
      <Text style={styles.formButtonLabel}>{label}</Text>
      <Number
        numberFontStyle={{ fontSize: 12 }}
        decimalFontStyle={{ fontSize: 12 }}
      >
        {display.value}
      </Number>
    </TouchableOpacity>
  )
}

const FormTextarea = ({ field }: { field: Field }): ReactElement => {
  const { attrs, setValue } = field
  return (
    <View style={{ height: 100 }}>
      <DefaultFormInput
        value={attrs.value}
        multiline
        placeholder={attrs.placeholder}
        secureTextEntry={attrs.type === 'password'}
        style={{
          height: 100,
          textAlignVertical: 'top',
        }}
        onChangeText={setValue}
      />
    </View>
  )
}

const FormInput = ({ field }: { field: Field }): ReactElement => {
  const { attrs, setValue, error } = field
  return (
    <DefaultFormInput
      secureTextEntry={attrs.type === 'password'}
      errorMessage={error}
      value={attrs.value}
      placeholder={attrs.placeholder}
      onChangeText={setValue}
    />
  )
}

const FormSelect = ({ field }: { field: Field }): ReactElement => {
  const { attrs, setValue } = field
  const options: OptionProps[] = _.map(field.options, (option) => {
    return {
      label: option.children,
      value: option.value,
    }
  })
  return (
    <Select
      selectedValue={attrs.value}
      onValueChange={(value): void => {
        setValue && setValue(`${value}`)
      }}
      optionList={options}
    />
  )
}

const Form = ({ form }: Props): ReactElement => {
  const { fields } = form

  return (
    <View style={styles.container}>
      {fields.map((field, index) => (
        <Fragment key={`fields-${index}`}>
          <View style={styles.fieldLableBox}>
            <FormLabel text={field.label} />
            {field.button && <FormButton button={field.button} />}
          </View>

          <View style={styles.section}>
            {field.element === 'select' && (
              <FormSelect field={field} />
            )}
            {field.element === 'input' && <FormInput field={field} />}
            {field.element === 'textarea' && (
              <FormTextarea field={field} />
            )}
          </View>
        </Fragment>
      ))}
    </View>
  )
}

export default Form

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  fieldLableBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    position: 'relative',
    marginBottom: 20,
  },
  formButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formButtonLabel: {
    fontSize: 12,
    marginRight: 5,
  },
})
