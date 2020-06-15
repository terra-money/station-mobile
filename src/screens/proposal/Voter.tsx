import React from 'react'
import { Text } from 'react-native'
import { VoterUI, format } from '@terra-money/use-native-station'
import ExtLink from '../../components/ExtLink'

interface Props {
  voter: VoterUI
  noTruncate?: boolean
}

const Voter = ({ voter, noTruncate }: Props) => {
  // TODO: Return to this
  const { address } = voter

  return 'moniker' in voter ? (
    <Text>{voter.moniker}</Text>
  ) : (
    <ExtLink href={voter.link}>
      {noTruncate ? address : format.truncate(address, [7, 6])}
    </ExtLink>
  )
}

export default Voter
