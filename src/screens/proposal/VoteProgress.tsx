import React, { FC } from 'react'
import { Text, View } from 'react-native'
import { VoteProgressBar } from '@terra-money/use-native-station'

const Flag: FC<{ left: string }> = ({ left, children }) => {
  return <Text>{children}</Text>
}

const VoteProgress = ({ flag, list }: VoteProgressBar) => {
  return (
    <>
      {flag && <Flag left={flag.percent}>{flag.text}</Flag>}

      {list.map(({ percent, color }, index) => {
        return <View key={index} />
      })}
    </>
  )
}

export default VoteProgress
