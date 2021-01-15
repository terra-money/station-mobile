import React, { FC, ReactElement } from 'react'
import { Text, View } from 'react-native'
import { VoteProgressBar } from '@terra-money/use-native-station'

const Flag: FC<{ left: string }> = ({ children }) => (
  <Text>{children}</Text>
)

const VoteProgress = ({
  flag,
  list,
}: VoteProgressBar): ReactElement => (
  <>
    {flag && <Flag left={flag.percent}>{flag.text}</Flag>}

    {list.map(({}, index) => (
      <View key={index} />
    ))}
  </>
)

export default VoteProgress
