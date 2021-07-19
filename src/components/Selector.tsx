import React, { ReactElement, useRef } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  FlatList,
} from 'react-native'
import _ from 'lodash'

import { useModal } from 'hooks/useModal'
import color from 'styles/color'
import Text from './Text'
import layout from 'styles/layout'

const SelectItemList = <T,>({
  list,
  onSelect,
  modal,
  selectedValue,
  compareKey,
  flatListRef,
}: {
  modal: AppModal
  flatListRef: React.RefObject<FlatList<any>>
} & SelectorProps<T>): ReactElement => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.5)',
      }}
    >
      <TouchableOpacity onPress={modal.close} style={{ flex: 1 }} />
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          scrollEnabled={list.length > 6}
          getItemLayout={(
            data,
            index
          ): {
            length: number
            offset: number
            index: number
          } => ({
            length: 60,
            offset: 60 * index,
            index,
          })}
          onLayout={(): void => {
            if (selectedValue && flatListRef.current) {
              const index = list.findIndex((x) =>
                compareKey
                  ? selectedValue[compareKey] === x.value[compareKey]
                  : selectedValue === x.value
              )
              if (index > 0) {
                flatListRef.current.scrollToIndex({
                  animated: true,
                  index,
                })
              } else {
                if (list && _.some(list[0])) {
                  onSelect(list[0]?.value)
                }
              }
            }
          }}
          data={list}
          keyExtractor={(item, index): string => `items-${index}`}
          renderItem={({ item, index }): ReactElement => {
            return (
              <TouchableOpacity
                onPress={(): void => {
                  if (item.disabled) {
                    return
                  }

                  onSelect(item.value)
                  modal.close()
                }}
                activeOpacity={item.disabled ? 1 : undefined}
                style={[
                  styles.item,
                  {
                    borderTopWidth: index === 0 ? 0 : 1,
                    borderTopColor: '#edf1f7',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.label,
                    { opacity: item.disabled ? 0.3 : 1 },
                  ]}
                  fontType={'medium'}
                >
                  {item.label}
                </Text>
                <View
                  style={{
                    backgroundColor: '#d2daf0',
                    width: 20,
                    height: 20,
                    borderRadius: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: item.disabled ? 0.3 : 1,
                  }}
                >
                  {(compareKey
                    ? selectedValue[compareKey] ===
                      item.value[compareKey]
                    : selectedValue === item.value) && (
                    <View
                      style={{
                        backgroundColor: color.sapphire,
                        width: 12,
                        height: 12,
                        borderRadius: 100,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    </View>
  )
}

type SelectorProps<T> = {
  containerStyle?: StyleProp<ViewStyle>
  display: string | ReactElement
  selectedValue: T
  list: {
    label: string
    value: T
    disabled?: boolean
  }[]
  onSelect: (value: T) => void
  compareKey?: keyof T
  disabled?: boolean
}

const Selector = <T,>(props: SelectorProps<T>): ReactElement => {
  const { modal } = useModal()
  const flatListRef = useRef<FlatList>(null)

  const onPress = (): void => {
    modal.open(SelectItemList({ ...props, modal, flatListRef }))
  }
  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={props.disabled}
      style={props.containerStyle}
      onPress={onPress}
    >
      {typeof props.display === 'string' ? (
        <Text>{props.display}</Text>
      ) : (
        props.display
      )}
    </TouchableOpacity>
  )
}

export default Selector

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    borderRadius: 18,
    paddingVertical: 18,
    maxHeight: 400,
    marginHorizontal: 20,
    marginBottom: layout.getNotchCoverPaddingBottom,
  },
  item: {
    paddingHorizontal: 30,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
})
