import React, { ReactElement } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import _ from 'lodash'

import { Text } from 'components'
import color from 'styles/color'
import { ChainConfig } from 'use-station/src'
import networks from '../../../networks'
import { settings } from 'utils/storage'

const NetworkOptionDrawer = ({
  chain,
  drawer,
}: {
  chain: ChainConfig
  drawer: Drawer
}): ReactElement => {
  return (
    <View style={styles.container}>
      {_.map(_.toArray(networks), (network, index) => {
        return (
          <TouchableOpacity
            key={`networks-${index}`}
            onPress={(): void => {
              chain.set(network)
              settings.set({ chain: network })
              drawer.close()
            }}
            style={[
              styles.networkItem,
              index !== 0 && {
                borderTopWidth: 1,
                borderTopColor: '#edf1f7',
              },
            ]}
          >
            <Text style={styles.networkName} fontType={'medium'}>
              {network.name}
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
              {chain.current === network && (
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
    </View>
  )
}

export default NetworkOptionDrawer

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    borderRadius: 18,
  },
  networkItem: {
    paddingHorizontal: 30,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  networkName: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
})
