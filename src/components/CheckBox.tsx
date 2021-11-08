import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { COLOR } from 'consts'

import Text from './Text'

const CheckBox = ({
  label,
  checked,
  onPress,
  disabled,
}: {
  label: string
  checked?: boolean
  onPress: () => void
  disabled?: boolean
}): ReactElement => {
  return (
    <TouchableOpacity
      onPress={(): void => {
        if (disabled) {
          return
        }
        onPress()
      }}
      style={styles.container}
    >
      <View style={styles.checkBox}>
        {checked && <View style={styles.checked} />}
      </View>
      <Text>{label}</Text>
    </TouchableOpacity>
  )
}

export default CheckBox

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    width: 13,
    height: 13,
    backgroundColor: '#ccd6f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checked: {
    width: 7,
    height: 7,
    backgroundColor: COLOR.primary._02,
  },
})
