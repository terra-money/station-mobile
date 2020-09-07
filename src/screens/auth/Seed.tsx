import React, { FC } from 'react'
import { TouchableOpacity } from 'react-native'
import { View, Text, TextInput } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet';

interface Props {
  label: string
  attrs: {
    value?: string
    onFocus: () => void
    onChangeText?: (value: string) => void
    onPaste: () => void
  }
  isFocused: boolean
  suggest: (word: string) => string[]
  onSelect: (s: string) => void
}

const Seed: FC<Props> = (props) => {
  const { label, attrs, onSelect, isFocused, suggest } = props
  const { value } = attrs

  /* Suggestions */
  const suggestions = suggest(value as string)
  const showSuggestions = isFocused && !!suggestions.length

  /* render */
  return (
    <View style={styles.field}>
      <Text>{label}.</Text>
      <TextInput {...attrs} />
      {showSuggestions &&
        suggestions.map((w, index) => (
          <TouchableOpacity onPress={() => onSelect(w)} key={w}>
            <Text>{w}</Text>
          </TouchableOpacity>
        ))}
    </View>
  )
}

export default Seed

/* styles */
const styles = EStyleSheet.create({
  field: {
    width: '25%',
  },
})
