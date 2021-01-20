import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { ProposalUI } from 'use-station/src'
import Badge from 'components/Badge'
import Voter from './Voter'
import Text from 'components/Text'

const ProposerHeader = ({
  title,
  ...rest
}: ProposalUI): ReactElement => {
  const {
    statusTranslation,
    meta,
    proposer,
    description,
    details,
  } = rest

  return (
    <>
      <Badge text={statusTranslation} />

      <Text>{title}</Text>
      <Text>{meta}</Text>
      <Voter voter={proposer} noTruncate />

      <Text>{description}</Text>

      {details.map(({ title, content }) => (
        <View key={title}>
          <Text>{title}</Text>
          <Text>{content}</Text>
        </View>
      ))}
    </>
  )
}

export default ProposerHeader
