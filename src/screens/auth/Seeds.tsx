import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import { Mnemonics as Props } from '@terra-money/use-native-station'
import EStyleSheet from 'react-native-extended-stylesheet'
import Seed from './Seed'
import Text from 'components/Text'

const Seeds = ({
  title,
  fields,
  paste,
  suggest,
}: Props): ReactElement => {
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
              onFocus: (): void => setCurrentFocusIndex(index),
              onChangeText: setValue,
              onPaste: (): void => {
                const clipboard = ''
                paste(clipboard, index)
              },
            }}
            isFocused={index === currentFocusIndex}
            suggest={suggest}
            onSelect={(w): void => {
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
const styles = EStyleSheet.create({
  form: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
