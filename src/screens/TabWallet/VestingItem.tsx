import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'

import { VestingItemUI } from 'lib'

import { Text, Icon, Number, AssetIcon } from 'components'
import { COLOR } from 'consts'
import { RootStackParams } from 'types'

const VestingItem = ({
  item,
  title,
}: {
  item: VestingItemUI
  title: string
}): ReactElement => {
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  const { display } = item
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.iconBox}>
          <AssetIcon name={display.unit} />
        </View>
        <View>
          <Text style={styles.vesting}>VESTING</Text>
          <Text style={styles.unit} fontType={'bold'}>
            {display.unit}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={(): void => {
          navigate('VestingSchedule', {
            item,
            title,
          })
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ alignItems: 'flex-end' }}>
            <Number
              numberFontStyle={{ fontSize: 15 }}
              decimalFontStyle={{ fontSize: 11 }}
              fontType={'medium'}
            >
              {display.value}
            </Number>
          </View>

          <View style={styles.coinMenu}>
            <Icon
              size={16}
              style={{ color: COLOR.primary._02 }}
              name={'chevron-right'}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default VestingItem

const styles = StyleSheet.create({
  container: {
    height: 64,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 35,
    shadowOpacity: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconBox: {
    paddingRight: 6,
  },
  coinMenu: {
    width: 14,
    height: 14,
    backgroundColor: COLOR.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  vesting: {
    fontSize: 10,
    lineHeight: 10,
    letterSpacing: 0,
  },
  unit: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
})
