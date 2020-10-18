import React from 'react'
import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ProposalItemUI } from '@terra-money/use-native-station'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Orb from '../../components/Orb'
import VoteChart from './VoteChart'


/** 
 * i18n 적용 시 어떻게 분기할 것인지...
 */
const getStatusColor = (c: string) => {
  return c.toUpperCase() === 'PASSED'
    ? 'rgb(84, 147, 247)'
    : c.toUpperCase() === 'REJECTED'
    ? 'rgb(255, 85, 97)'
    : c.toUpperCase() === 'DEPOSIT'
    ? 'rgb(26, 153, 128)'
    : c.toUpperCase() === 'VOTING'
    ? 'rgb(122, 111, 240)'
    : 'rgb(0,0,0)'//undefined
}

const ProposalItem = (proposal: ProposalItemUI) => {
  const { id, statusTranslation, title, meta, deposit, vote } = proposal
  const { navigate } = useNavigation()

  console.log('id', id)
  console.log('statusTranslation', statusTranslation)
  console.log('title', title)
  console.log('meta', deposit)
  console.log('vote', vote)
  console.log('meta', meta)

  const renderDetail = (d: { title: string; content: string }, i: number) => (
    i === 0
    ?
    <View style={{flexDirection:'column', alignItems:'center'}}>
      <Text style={{fontSize:12, lineHeight:18, color:'rgb(32,67,181)'}}>{d.title}</Text>
      <Text style={{fontSize:16, lineHeight:24, color:'rgb(32,67,181)'}}>{d.content}</Text>
    </View>
    : 
    <View style={{flexDirection:'row', justifyContent:'center', marginTop:10,}}>
      <Text style={{fontSize:11, lineHeight:18, color:'rgb(32,67,181)'}}>{d.title}</Text>
      <Text style={{fontSize:11, lineHeight:18, color:'rgb(32,67,181)'}}> </Text>
      <Text style={{fontSize:11, lineHeight:18, color:'rgb(32,67,181)'}}>{d.content}</Text>
    </View>
  )

  const footer = deposit ? (
    <View style={{alignItems:'center', marginTop:20, marginBottom:5}}>
      <Orb ratio={deposit.ratio} completed={deposit.completed} size={100} />
      {deposit.contents.map(renderDetail)}
    </View>
  ) : vote ? (
    <View style={{alignItems:'center', marginTop:20, marginBottom:5}}>
      <VoteChart options={vote.list} />
      {vote.contents.map(renderDetail)}
    </View>
  ) : null

  return (
    <Card onPress={() => navigate('Proposal', { id })}>
      {/* <Badge>{statusTranslation}</Badge> */}
      <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:2}}>
        <Text style={{color:getStatusColor(statusTranslation)}}>{statusTranslation}</Text>
        <View style={{flexDirection:'row'}}>
          <Text style={{fontSize:12, lineHeight:18, color:'rgb(32,67,181)'}}>ID: </Text>
          <Text style={{fontSize:12, lineHeight:18, color:'rgb(32,67,181)'}}>{id}</Text>
        </View>
      </View>
      <Text style={{fontSize:18,lineHeight:24,color:'rgb(32,67,181)'}}>{title}</Text>
      <Text style={{fontSize:11,lineHeight:18,color:'rgb(32,67,181)'}}>{meta}</Text>
      {footer}
    </Card>
  )
}

export default ProposalItem
