import React, { ReactElement, useState } from 'react'
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { Coin } from '@terra-money/terra.js'
import { useQuery } from 'react-query'
import Tooltip from 'react-native-walkthrough-tooltip'

import { AvailableItem, format, useConfig, useIsClassic } from 'lib'

import { UTIL } from 'consts'

import { Text, Icon, Number, AssetIcon, Row } from 'components'
import { COLOR } from 'consts'
import { QueryKeyEnum, RootStackParams, Token } from 'types'
import { useSwapRate } from 'hooks/useSwapRate'
import images from 'assets/images'
import { useDenomTrace } from 'hooks/useDenomTrace'

const IBCUnit = ({
  symbol,
  path,
  hash,
}: {
  symbol?: string
  path?: string
  hash?: string
}): ReactElement => {
  const [
    isVisibleSpreadTooltip,
    setisVisibleSpreadTooltip,
  ] = useState(false)

  if (!hash) return <Text>{UTIL.truncate(hash)}</Text>

  return (
    <Row>
      <Tooltip
        isVisible={isVisibleSpreadTooltip}
        content={
          <View>
            <Text fontType="medium" style={{ color: COLOR.white }}>
              {UTIL.truncate(hash)}
            </Text>
            <Text style={{ color: COLOR.white, fontSize: 12 }}>
              ({path?.replace('transfer/', '')})
            </Text>
          </View>
        }
        placement="top"
        onClose={(): void => setisVisibleSpreadTooltip(false)}
        contentStyle={{
          backgroundColor: COLOR.primary._02,
        }}
      >
        <TouchableOpacity
          onPress={(e): void => {
            e.stopPropagation()
            setisVisibleSpreadTooltip(true)
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 10,
            paddingRight: 15,
          }}
        >
          <Text style={styles.unit} fontType={'bold'}>
            {format.denom(symbol)}
          </Text>

          <Icon
            name={'info'}
            color={COLOR.primary._02}
            size={14}
            style={{ marginLeft: 5 }}
          />
        </TouchableOpacity>
      </Tooltip>
    </Row>
  )
}

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
  const isIbcDenom = UTIL.isIbcDenom(item.denom)
  const ibcDenom = useDenomTrace(item.denom)
  const isClassic = useIsClassic()
  const ASSET = 'https://assets.terra.money/icon'

  const icon =
    item.denom && UTIL.isNativeDenom(item.denom)
      ? (
        (!isClassic && item.display.unit === 'Luna')
        ? `${ASSET}/svg/LUNA.png`
        : `${ASSET}/60/${item.display.unit}.png`
      ) : item.icon

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
            {(isIbcDenom && !icon) ? (
              <Image
                source={images.IBC}
                style={{ width: 18, height: 18 }}
              />
            ) : (
              <AssetIcon uri={icon} />
            )}
          </View>
          {isIbcDenom ? (
            <IBCUnit
              symbol={item.display?.unit}
              path={ibcDenom.data?.path}
              hash={item.denom?.replace('ibc/', '')}
            />
          ) : (
            <Text style={styles.unit} fontType={'bold'}>
              {display.unit}
            </Text>
          )}
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
              style={{ color: COLOR.primary._02 }}
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
    backgroundColor: COLOR.white,
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
