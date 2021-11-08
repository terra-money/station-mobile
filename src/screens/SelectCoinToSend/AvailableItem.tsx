import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { Coin } from '@terra-money/terra.js'
import { useQuery } from 'react-query'

import { AvailableItem, useConfig } from 'lib'

import { UTIL } from 'consts'

import { Text, Icon, Number, AssetIcon } from 'components'
import color from 'styles/color'
import { QueryKeyEnum, RootStackParams, Token } from 'types'
import { useSwapRate } from 'hooks/useSwapRate'

const AssetItem = ({
  item,
  toAddress,
}: {
  item: AvailableItem
  toAddress?: string
}): ReactElement => {
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()
  const { getSwapAmount } = useSwapRate()
  const { currency } = useConfig()
  const { display } = item

  const icon =
    item.denom && UTIL.isNativeDenom(item.denom)
      ? `https://assets.terra.money/icon/60/${item.display.unit}.png`
      : item.icon

  const { data: swapValue = '' } = useQuery(
    [QueryKeyEnum.swapAmount, item, currency.current],
    async () => {
      return (
        currency.current &&
        item.denom &&
        getSwapAmount(
          new Coin(
            item.denom,
            UTIL.microfy(UTIL.delComma(display.value) as Token)
          ),
          currency.current.key
        )
      )
    }
  )

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.inner}
        onPress={(): void => {
          navigate('Send', {
            denomOrToken: item.denom || item.token || '',
            toAddress,
          })
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.iconBox}>
            <AssetIcon uri={icon} />
          </View>
          <Text style={styles.unit} fontType={'bold'}>
            {display.unit}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexShrink: 1,
          }}
        >
          <View
            style={{
              alignItems: 'flex-end',
              paddingLeft: 20,
              flexShrink: 1,
            }}
          >
            <Number
              numberFontStyle={{ fontSize: 15 }}
              decimalFontStyle={{ fontSize: 11 }}
              fontType={'medium'}
            >
              {display.value}
            </Number>
            {!!swapValue && (
              <Number
                numberFontStyle={{
                  opacity: 0.5,
                  fontSize: 10,
                  marginTop: 2,
                }}
                decimalFontStyle={{
                  opacity: 1,
                  fontSize: 10,
                  marginTop: 2,
                }}
                value={UTIL.formatAmount(swapValue)}
                unit={currency.current?.value}
              />
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
    paddingVertical: 10,
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
  },
  inner: {
    minHeight: 44,
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
