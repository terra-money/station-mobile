import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Mnemonics as Props } from '@terra-money/use-native-station'
import Seed from './Seed'

const Seeds = ({ title, fields, paste, suggest }: Props) => {
  const [currentFocusIndex, setCurrentFocusIndex] = useState<number>()

  return (
    <>
      <Text>{title}</Text>
      <View style={styles.form}>
        {fields.map(({ label, attrs, setValue }, index) => (
          <Seed
            label={label}
            attrs={{
              ...attrs,
              onFocus: () => setCurrentFocusIndex(index),
              onChangeText: setValue,
              onPaste: () => {
                const clipboard = ''
                paste(clipboard, index)
              },
            }}
            isFocused={index === currentFocusIndex}
            suggest={suggest}
            onSelect={(w) => {
              setValue?.(w)
              setCurrentFocusIndex((i = 0) =>
                i + 1 < fields.length ? i + 1 : i
              )
            }}
            key={index}
          />
        ))}
      </View>
    </>
  )
}

export default Seeds

/* styles */
const styles = StyleSheet.create({
  form: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
