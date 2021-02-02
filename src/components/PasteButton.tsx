import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Clipboard from '@react-native-community/clipboard'

import { Text, Icon } from 'components'

import color from 'styles/color'

export type PasteButtonProps = {
  onPress: (copiedString: string) => void
}

const PasteButton = (props: PasteButtonProps): ReactElement => {
  const onPress = async (): Promise<void> => {
    const copied = await Clipboard.getString()
    props.onPress(copied)
  }
  return (
    <TouchableOpacity onPress={onPress} style={styles.copyButton}>
      <Icon name={'content-paste'} color={color.sapphire} />
      <Text style={{ color: color.sapphire, fontSize: 10 }}>
        PASTE
      </Text>
    </TouchableOpacity>
  )
}

export default PasteButton

const styles = StyleSheet.create({
  copyButton: {
    flexDirection: 'row',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: color.sapphire,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
})
