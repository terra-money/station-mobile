import React, { ReactElement } from 'react'
import { ChartKey } from 'use-station/src'
import { View, StyleSheet } from 'react-native'

import ChartItem from './ChartItem'

const List: ChartKey[] = [
  'TxVolume',
  'StakingReturn',
  'TaxRewards',
  'TotalAccounts',
]

const Charts = (): ReactElement => (
  <View style={styles.charts}>
    {List.map((chartKey) => (
      <View key={chartKey} style={styles.row}>
        <ChartItem chartKey={chartKey} />
      </View>
    ))}
  </View>
)

const styles = StyleSheet.create({
  charts: {
    marginTop: -5,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 20,
    shadowOpacity: 0.05,
  },
  row: {
    borderBottomColor: '#EDF1F7',
    borderBottomWidth: 1,
  },
})

export default Charts
