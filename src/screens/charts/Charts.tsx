import React from 'react'
import { ChartKey } from '@terra-money/use-native-station'
import ChartItem from './ChartItem'

const List: ChartKey[] = [
  'TxVolume',
  'StakingReturn',
  'TaxRewards',
  'TotalAccounts',
]

const Charts = () => (
  <>
    {List.map((chartKey) => (
      <ChartItem chartKey={chartKey} key={chartKey} />
    ))}
  </>
)

export default Charts
