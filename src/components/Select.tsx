import React, { ReactElement } from 'react'
import { Platform, TextStyle, View, ViewStyle } from 'react-native'
import PickerSelect, { PickerStyle } from 'react-native-picker-select'

import color from 'styles/color'
import font from 'styles/font'
import Icon from './Icon'

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
  icon?: React.ReactNode
} & PickerStyle

const Select = (props: SelectProps): ReactElement => {
  const textStyle: TextStyle = {
    color: color.sapphire,
    paddingLeft: 10,
    fontFamily: font.gotham.book,
  }

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
          paddingRight: Platform.OS === 'ios' ? 25 : 0,
          ...props.containerStyle,
        },
        inputAndroid: {
          ...textStyle,
          ...props.textStyle,
        },
        // ios11 text style
        inputIOS: {
          ...textStyle,

          ...props.textStyle,
        },
      }}
      placeholder={{}}
      {...props}
      pickerProps={{
        // g7 text style
        style: {
          ...textStyle,
          ...props.textStyle,
        },
        dropdownIconColor: color.sapphire,
      }}
      Icon={
        props.icon ||
        (Platform.OS === 'ios'
          ? (): ReactElement => (
              <View style={{ marginRight: -10 }}>
                <Icon
                  name={'arrow-drop-down'}
                  size={18}
                  color={color.sapphire}
                />
              </View>
            )
          : undefined)
      }
    />
  )
}

export default Select
