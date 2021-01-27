import React, { ReactElement } from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import PickerSelect, { PickerStyle } from 'react-native-picker-select'

import color from 'styles/color'

export type SelectOptionProps = {
  label: string
  value: string | number
}

export type SelectProps = {
  selectedValue?: string | number
  optionList: SelectOptionProps[]
  onValueChange: (
    itemValue: string | number,
    itemIndex: number
  ) => void
  containerStyle?: ViewStyle
  textStyle?: TextStyle
  disabled?: boolean
} & PickerStyle

const Select = (props: SelectProps): ReactElement => {
  return (
    <PickerSelect
      value={props.selectedValue}
      items={props.optionList}
      style={{
        viewContainer: {
          height: 45,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#cfd8ea',
          backgroundColor: color.white,
          justifyContent: 'center',
          paddingLeft: 5,
          ...props.containerStyle,
        },
        inputAndroid: {
          fontFamily: 'Gotham-Medium',
          ...props.textStyle,
        },
        inputIOS: { fontFamily: 'Gotham-Medium', ...props.textStyle },
      }}
      placeholder={{}}
      {...props}
    />
  )
}

export default Select
