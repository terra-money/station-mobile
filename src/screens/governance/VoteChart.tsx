import React from 'react'
import { gt } from '@terra-money/use-native-station'
import { VoteOption } from '@terra-money/use-native-station'
import { Text } from 'react-native'
// import Chart from '../../components/Chart'
// import Orb from '../../components/Orb'

const VoteChart = ({ options }: { options: VoteOption[] }) => {
  const filtered = options.filter((o) => gt(o.ratio, 0))
  return filtered.length ? <Text>Chart</Text> : <Orb size={100} />
}

export default VoteChart
