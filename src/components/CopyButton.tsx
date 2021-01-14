import React, { ReactElement } from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import color from 'styles/color'

export type CopyButtonProps = {
  copyString: string
}

const CopyButton = (props: CopyButtonProps): ReactElement => {
  return (
    <TouchableOpacity
      onPress={(): void => {
        Clipboard.setString(props.copyString)
      }}
      style={styles.copyButton}
    >
      <MaterialIcons name={'description'} color={color.sapphire} />
      <Text style={{ color: color.sapphire, fontSize: 10 }}>
        COPY
      </Text>
    </TouchableOpacity>
  )
}

export default CopyButton

const styles = StyleSheet.create({
  copyButton: {
    flexDirection: 'row',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: color.sapphire,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
})
