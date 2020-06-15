import React from 'react'
import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ProposalItemUI } from '@terra-money/use-native-station'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Orb from '../../components/Orb'
import VoteChart from './VoteChart'

const ProposalItem = (proposal: ProposalItemUI) => {
  const { id, statusTranslation, title, meta, deposit, vote } = proposal
  const { navigate } = useNavigation()

  const renderDetail = (d: { title: string; content: string }, i: number) => (
    <View key={i}>
      <Text>{d.title}</Text>
      <Text>{d.content}</Text>
    </View>
  )

  const footer = deposit ? (
    <>
      <Orb ratio={deposit.ratio} completed={deposit.completed} size={100} />
      {deposit.contents.map(renderDetail)}
    </>
  ) : vote ? (
    <>
      <VoteChart options={vote.list} />
      {vote.contents.map(renderDetail)}
    </>
  ) : null

  return (
    <Card onPress={() => navigate('Proposal', { id })}>
      <Badge>{statusTranslation}</Badge>
      <Text>ID: {id}</Text>
      <Text>{title}</Text>
      <Text>{meta}</Text>
      {footer}
    </Card>
  )
}

export default ProposalItem
