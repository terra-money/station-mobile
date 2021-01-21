import React, { ReactElement } from 'react'
import { VoterUI, format } from 'use-station/src'
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
    <ExtLink
      url={voter.link}
      title={noTruncate ? address : format.truncate(address, [7, 6])}
    />
  )
}

export default Voter
