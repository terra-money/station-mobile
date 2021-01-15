import React, { ReactElement } from 'react'
import PickerSelect, { PickerStyle } from 'react-native-picker-select'

import color from 'styles/color'

export type SelectProps = {
  selectedValue?: string | number
  optionList: { label: string; value: string | number }[]
  onValueChange: (
    itemValue: string | number,
    itemIndex: number
  ) => void
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
          paddingLeft: 15,
        },
      }}
      placeholder={{}}
      {...props}
    />
  )
}

export default Select
