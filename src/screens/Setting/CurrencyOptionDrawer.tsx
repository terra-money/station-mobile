import React, { ReactElement } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import _ from 'lodash'

import { Text } from 'components'
import color from 'styles/color'
import { CurrencyConfig } from 'use-station/src'
import { settings } from 'utils/storage'

const CurrencyOptionDrawer = ({
  currencyConfig,
  drawer,
}: {
  currencyConfig: CurrencyConfig
  drawer: Drawer
}): ReactElement => {
  return (
    <View style={styles.container}>
      <ScrollView>
        {_.map(currencyConfig.list, (currency, index) => {
          return (
            <TouchableOpacity
              key={`currencys-${index}`}
              onPress={(): void => {
                currencyConfig.set(currency.key)
                settings.set({ currency: currency.key })
                drawer.close()
              }}
              style={[
                styles.currencyItem,
                index === 0
                  ? { marginTop: -18 }
                  : {
                      borderTopWidth: 1,
                      borderTopColor: '#edf1f7',
                    },
              ]}
            >
              <Text style={styles.currencyName} fontType={'medium'}>
                {currency.value}
              </Text>
              <View
                style={{
                  backgroundColor: '#d2daf0',
                  width: 20,
                  height: 20,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {currencyConfig.current?.key === currency.key && (
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
        })}
      </ScrollView>
    </View>
  )
}

export default CurrencyOptionDrawer

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    borderRadius: 18,
    paddingVertical: 18,
    marginTop: 20,
    maxHeight: 400,
  },
  currencyItem: {
    paddingHorizontal: 30,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currencyName: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
})
