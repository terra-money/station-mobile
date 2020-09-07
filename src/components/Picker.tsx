import React from 'react'
import { Text, View } from 'react-native'
import { StyleProp, TextStyle } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Options } from '@terra-money/use-native-station'
import { useApp } from '../hooks'
import Icon from 'react-native-vector-icons/MaterialIcons'
import EStyleSheet from 'react-native-extended-stylesheet';

interface Props {
  value?: string
  onChange?: (value: string) => void
  options?: Options
  style?: StyleProp<TextStyle>
}

const Picker = ({ value: current, onChange, options, style }: Props) => {
  const { drawer } = useApp()

  const submit = (value: string) => {
    onChange?.(value)
    drawer.close()
  }

  const picker = (
    <>
      {options?.map(({ value, children }) => (
        <TouchableOpacity onPress={() => submit(value)} key={value}>
          <Text>
            {children}
            {value === current && ' ✓'}
          </Text>
        </TouchableOpacity>
      ))}
    </>
  )

  const { children } = options?.find((o) => o.value === current) ?? {}

  return (
    <TouchableOpacity onPress={() => drawer.open(picker)}>
      <View style={styles.badge}>
        <Text style={[style, styles.badge_text]}>{children}</Text>
        <Icon name="arrow-drop-down" size={18} color="#fff" style={styles.icon} />
      </View>
    </TouchableOpacity>
  )
}

/* styles */
const styles = EStyleSheet.create({
  icon: {
    marginLeft: 5,
    marginRight: -5
  },

  badge: {
    backgroundColor: "rgba(255,255,255,0.1)",
    height: 28,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: -2,
    flexDirection: "row",
    alignItems: "center"
  },

  badge_text: {
    fontSize: 12,
    lineHeight: 22,
    color: "rgba(255,255,255,1)",
    fontFamily: "TerraCompact-Regular",
  },
})

export default Picker
