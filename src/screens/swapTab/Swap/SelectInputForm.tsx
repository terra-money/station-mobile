import React, { ReactElement } from 'react'
import { View, StyleSheet } from 'react-native'
import _ from 'lodash'

import { Field } from 'use-station/src'

import Input from 'components/Input'
import { Text, Icon, SelectOptionProps, Select } from 'components'

import color from 'styles/color'
import layout from 'styles/layout'

const SelectInputForm = ({
  selectField,
  inputField,
}: {
  selectField: Field
  inputField: Field
}): ReactElement => {
  const options: SelectOptionProps[] = _.map(
    selectField.options?.filter((x) => !x.disabled),
    (option) => {
      return {
        label: option.children,
        value: option.value,
      }
    }
  )
  const { error: inputError } = inputField
  const { error: selectError } = selectField
  const error = inputError || selectError

  return (
    <View
      style={{
        marginBottom: 10,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#cfd8ea',
          marginBottom: 5,
        }}
      >
        <Select
          disabled={options.length < 1}
          selectedValue={selectField.attrs.value}
          onValueChange={(value): void => {
            selectField.setValue && selectField.setValue(`${value}`)
          }}
          optionList={options}
          containerStyle={{
            flex: layout.getScreenWideType() === 'narrow' ? 2 : 1,
            borderWidth: 0,
            borderRadius: 0,
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            backgroundColor: !inputField.attrs.readOnly
              ? 'white'
              : '#ebeff8',
          }}
        />
        <Input
          value={inputField.attrs.value}
          defaultValue={inputField.attrs.defaultValue}
          editable={!inputField.attrs.readOnly}
          placeholder={inputField.attrs.placeholder}
          onChangeText={inputField.setValue}
          containerStyle={{ flex: 2, borderWidth: 0 }}
          style={{
            borderRadius: 0,
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
          }}
          autoCorrect={false}
        />
      </View>
      {_.some(error) && (
        <View style={styles.errorMessageBox}>
          <Icon name={'info'} color={color.red} size={12} />
          <Text style={styles.errorMessage} fontType={'medium'}>
            {error}
          </Text>
        </View>
      )}
    </View>
  )
}

export default SelectInputForm

const styles = StyleSheet.create({
  errorMessageBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  errorMessage: {
    color: color.red,
    fontSize: 10,
    paddingLeft: 5,
  },
})
