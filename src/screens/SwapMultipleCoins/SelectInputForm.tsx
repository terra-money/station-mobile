import React, { ReactElement } from 'react'
import { View } from 'react-native'
import _ from 'lodash'

import { LAYOUT } from 'consts'

import { Field } from 'lib'

import Input from 'components/Input'
import { SelectOptionProps, Select } from 'components'

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
  return (
    <View
      style={{
        marginBottom: 10,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <Select
          selectedValue={
            options.find((x) => x.value === selectField.attrs.value)
              ?.value || ''
          }
          onValueChange={(value): void => {
            selectField.setValue && selectField.setValue(`${value}`)
          }}
          optionList={[{ label: 'SELECT', value: '' }, ...options]}
          containerStyle={{
            flex: LAYOUT.getScreenWideType() === 'narrow' ? 2 : 1,
            marginRight: 10,
            backgroundColor: 'white',
          }}
        />
        <Input
          value={inputField.attrs.value}
          defaultValue={inputField.attrs.defaultValue}
          placeholder={inputField.attrs.placeholder}
          onChangeText={inputField.setValue}
          containerStyle={{ flex: 2, borderWidth: 0 }}
          keyboardType="numeric"
          style={{ backgroundColor: '#ebeff8' }}
          autoCorrect={false}
        />
      </View>
    </View>
  )
}

export default SelectInputForm
