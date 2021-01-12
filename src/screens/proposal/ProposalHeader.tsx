import React from 'react'
import { View, Text } from 'react-native'
import { ProposalUI } from '@terra-money/use-native-station'
import Badge from '../../components/Badge'
import Voter from './Voter'

const ProposerHeader = ({ title, ...rest }: ProposalUI) => {
  const {
    statusTranslation,
    meta,
    proposer,
    description,
    details,
  } = rest

  return (
    <>
      <Badge>{statusTranslation}</Badge>

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
