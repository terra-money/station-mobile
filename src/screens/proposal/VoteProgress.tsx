import React, { FC, ReactElement } from 'react'
import { View } from 'react-native'
import { VoteProgressBar } from 'use-station/src'

import Text from 'components/Text'

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
