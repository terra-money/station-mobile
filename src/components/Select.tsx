import React, { ReactElement } from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'

import color from 'styles/color'
import Selector from './Selector'
import Text from './Text'
import Icon from './Icon'

export type SelectOptionProps = {
  label: string
  value: string | number
}

export type SelectProps = {
  selectedValue: string | number
  optionList: SelectOptionProps[]
  onValueChange: (itemValue: string | number) => void
  containerStyle?: ViewStyle
  textStyle?: TextStyle
  disabled?: boolean
  icon?: React.ReactNode
}

const Select = (props: SelectProps): ReactElement => {
  const { optionList, selectedValue } = props

  return (
    <Selector
      containerStyle={{
        height: 45,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#cfd8ea',
        backgroundColor: color.white,
        justifyContent: 'center',
        paddingLeft: 5,
        ...props.containerStyle,
      }}
      disabled={props.disabled}
      selectedValue={selectedValue || ''}
      list={optionList}
      display={
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 10,
          }}
        >
          <Text style={props.textStyle}>
            {optionList.find((x) => x.value === selectedValue)?.label}
          </Text>
          <View style={{ marginRight: 10 }}>
            <Icon
              name={'arrow-drop-down'}
              size={18}
              color={color.sapphire}
            />
          </View>
        </View>
      }
      onSelect={props.onValueChange}
    />
  )
}

export default Select
