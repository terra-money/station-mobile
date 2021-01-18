import React, { ReactElement } from 'react'
import { VoterUI, format } from '@terra-money/use-native-station'
import ExtLink from 'components/ExtLink'
import Text from 'components/Text'

interface Props {
  voter: VoterUI
  noTruncate?: boolean
}

const Voter = ({ voter, noTruncate }: Props): ReactElement => {
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
