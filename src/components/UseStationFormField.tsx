import React, { ReactElement } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Field, DisplayCoin } from 'use-station/src'
import _ from 'lodash'

import Text from './Text'
import Select, { SelectOptionProps } from './Select'
import DefaultFormInput from './FormInput'
import Number from './Number'
import FormLabel from './FormLabel'
import color from 'styles/color'

type FieldButton = {
  label: string
  display: DisplayCoin
  attrs: { onClick: () => void }
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
      <Text style={styles.formButtonLabel}>{label}:</Text>
      <Number
        numberFontStyle={{
          fontSize: 12,
          color: color.dodgerBlue,
          textDecorationLine: 'underline',
        }}
        fontType="medium"
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
        defaultValue={attrs.defaultValue}
        editable={!attrs.readOnly}
        multiline
        placeholder={attrs.placeholder}
        secureTextEntry={attrs.type === 'password'}
        style={{
          textAlignVertical: 'top',
        }}
        containerStyle={{
          height: 100,
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
      keyboardType={attrs.type === 'number' ? 'numeric' : 'default'}
      errorMessage={error}
      value={attrs.value}
      defaultValue={attrs.defaultValue}
      editable={!attrs.readOnly}
      placeholder={attrs.placeholder}
      onChangeText={setValue}
    />
  )
}

const FormSelect = ({ field }: { field: Field }): ReactElement => {
  const { attrs, setValue } = field
  const options: SelectOptionProps[] = _.map(
    field.options?.filter((x) => !x.disabled),
    (option) => {
      return {
        label: option.children,
        value: option.value,
      }
    }
  )
  return (
    <Select
      disabled={options.length < 1}
      selectedValue={attrs.value}
      onValueChange={(value): void => {
        setValue && setValue(`${value}`)
      }}
      optionList={options}
    />
  )
}

const FormField = ({ field }: { field: Field }): ReactElement => {
  return (
    <>
      <View style={styles.fieldLableBox}>
        {_.some(field.label) && <FormLabel text={field.label} />}
        {field.button && <FormButton button={field.button} />}
      </View>

      <View style={styles.section}>
        {field.element === 'select' && <FormSelect field={field} />}
        {field.element === 'input' && <FormInput field={field} />}
        {field.element === 'textarea' && (
          <FormTextarea field={field} />
        )}
      </View>
    </>
  )
}

export default FormField

const styles = StyleSheet.create({
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
    flexShrink: 1,
    paddingLeft: 20,
  },
  formButtonLabel: {
    fontSize: 12,
    marginRight: 5,
  },
})
