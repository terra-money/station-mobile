import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Clipboard from '@react-native-community/clipboard'

import { COLOR } from 'consts'

import Text from './Text'
import Icon from './Icon'

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
      <Icon name={'content-paste'} color={COLOR.primary._02} />
      <Text
        style={{
          color: COLOR.primary._02,
          fontSize: 10,
          marginLeft: 5,
        }}
        fontType="medium"
      >
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
    borderColor: COLOR.primary._02,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
})
