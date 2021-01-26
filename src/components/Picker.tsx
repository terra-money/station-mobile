import React, { ReactElement } from 'react'
import {
  View,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

import { Options } from 'use-station/src'

import { useApp } from '../hooks'
import { Text, Icon } from 'components'
import color from 'styles/color'

interface Props {
  value?: string
  onChange?: (value: string) => void
  options?: Options
  style?: StyleProp<TextStyle>
  showBox: boolean
  rightIcon?: string
}

const Picker = ({
  value: current,
  onChange,
  options,
  style,
  showBox,
  rightIcon,
}: Props): ReactElement => {
  const { drawer } = useApp()

  const submit = (value: string): void => {
    onChange?.(value)
    drawer.close()
  }

  const picker = (
    <View style={styles.pickerContainer}>
      {options?.map(({ value, children }, index) => (
        <View key={value}>
          <TouchableOpacity
            style={styles.pickerItemContainer}
            onPress={(): void => submit(value)}
          >
            <Text style={styles.pickerItemText}>{children}</Text>
            <View style={styles.pickerItemRadio}>
              {value === current && (
                <View style={styles.pickerItemRadioSelected} />
              )}
            </View>
          </TouchableOpacity>

          {
            // 마지막 index는 separator를 출력하지 않음
            options?.length !== index + 1 ? <View /> : null
          }
        </View>
      ))}
    </View>
  )

  const { children } = options?.find((o) => o.value === current) ?? {}

  return (
    <TouchableOpacity onPress={(): void => drawer.open(picker)}>
      {showBox === undefined ? (
        //DASHBOARD에서 사용
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{children}</Text>
          <Icon
            name="arrow-drop-down"
            size={18}
            color="#fff"
            style={styles.badgeIcon}
          />
        </View>
      ) : (
        // DASHBOARD 이외 Text만 출력되어야 할 곳에서 사용
        <View style={{ flexDirection: 'row' }}>
          <Text style={style}>{children}</Text>
          {rightIcon && (
            <Icon
              name={rightIcon}
              size={18}
              color="rgb(32, 67, 181)"
              style={{ marginLeft: 5 }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  )
}

/* styles */
const styles = StyleSheet.create({
  /**
   * BADGE
   */
  badge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    height: 28,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: -2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    marginLeft: 5,
    marginRight: -5,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 22,
    color: 'rgba(255,255,255,1)',
  },

  /**
   * PICKER
   */
  pickerContainer: {
    borderRadius: 18,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  pickerItemContainer: {
    paddingHorizontal: 30,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerItemText: {
    fontSize: 16,
    lineHeight: 24,
    color: color.sapphire,
  },
  pickerItemRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(32, 67, 181, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItemRadioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: color.sapphire,
  },
})

export default Picker
