import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import _ from 'lodash'
import { useRecoilValue } from 'recoil'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'

import { AvailableItem, useConfig } from 'use-station/src'

import { Text, Icon, Number, AssetIcon } from 'components'
import SwapRateStore from 'stores/SwapRateStore'
import color from 'styles/color'
import { RootStackParams } from 'types'

const AssetItem = ({
  item,
}: {
  item: AvailableItem
}): ReactElement => {
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()
  const { currency } = useConfig()
  const { icon, display } = item
  const swapValue = useRecoilValue(
    SwapRateStore.swapValue({
      denom: item.denom || '',
      value: display.value.replace(/,/g, ''),
    })
  )
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.iconBox}>
          <AssetIcon uri={icon} name={display.unit} />
        </View>
        <Text style={styles.unit} fontType={'bold'}>
          {display.unit}
        </Text>
      </View>
      <TouchableOpacity
        onPress={(): void => {
          navigate('Send', {
            denomOrToken: item.denom || item.token || '',
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
            {_.some(swapValue) && (
              <Text style={{ opacity: 0.5, fontSize: 10 }}>
                {swapValue} {currency.current?.value}
              </Text>
            )}
          </View>

          <View style={styles.coinMenu}>
            <Icon
              size={16}
              style={{ color: color.sapphire }}
              name={'chevron-right'}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default AssetItem

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
    backgroundColor: color.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unit: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
})
