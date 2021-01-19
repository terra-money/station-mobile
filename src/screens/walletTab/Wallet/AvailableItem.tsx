import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import _ from 'lodash'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { AvailableItem, useConfig } from 'use-station/src'
import AssetIcon, { AssetIconNameType } from 'components/AssetIcon'
import Number from 'components/Number'
import Text from 'components/Text'
import { useRecoilValue } from 'recoil'
import SwapRateStore from 'stores/SwapRateStore'
import color from 'styles/color'

const AssetItem = ({
  item,
  openCoinMenu,
}: {
  item: AvailableItem
  openCoinMenu: ({ symbol }: { symbol: string }) => void
}): ReactElement => {
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
          <AssetIcon
            uri={icon}
            name={display.unit as AssetIconNameType}
          />
        </View>
        <Text>{display.unit}</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ alignItems: 'flex-end' }}>
          <Number
            numberFontStyle={{ fontSize: 15 }}
            decimalFontStyle={{ fontSize: 11 }}
          >
            {display.value}
          </Number>
          {_.some(swapValue) && (
            <Text style={{ opacity: 0.5, fontSize: 10 }}>
              {swapValue} {currency.current?.value}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={(): void => {
            openCoinMenu({ symbol: item.denom || '' })
          }}
        >
          <View style={styles.coinMenu}>
            <MaterialIcons
              style={{ color: color.sapphire }}
              name={'arrow-right-alt'}
            />
          </View>
        </TouchableOpacity>
      </View>
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
    borderWidth: 1,
    borderRadius: 20,
    borderColor: color.sapphire,
    backgroundColor: color.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
})
