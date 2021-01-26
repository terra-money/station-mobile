import React, { ReactElement } from 'react'
import { View } from 'react-native'

import { VoteUI, percent } from 'use-station/src'
import Number from 'components/Number'
import { Text } from 'components'

import VoteChart from '../governance/VoteChart'
import VoteProgress from './VoteProgress'

const Vote = ({
  list,
  total,
  end,
  voted,
  progress,
}: VoteUI): ReactElement => (
  <>
    <VoteChart options={list} />
    <Text>{total.title}</Text>
    <Number {...total.display} fontSize={18} />
    <Text>{end.title}</Text>
    <Text>{end.date}</Text>

    {list.map(({ label, ratio, display }) => (
      <View key={label}>
        <Text>{label}</Text>
        <Text>{percent(ratio)}</Text>
        <Number fontSize={14}>{display.value}</Number>
      </View>
    ))}

    {progress && (
      <>
        <VoteProgress {...progress} />
        <Text>{voted[0]}</Text>
        <Text>{voted[1]}</Text>
      </>
    )}
  </>
)

export default Vote
