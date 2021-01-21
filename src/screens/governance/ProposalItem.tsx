import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ProposalItemUI } from 'use-station/src'
import Card from 'components/Card'
import Orb from 'components/Orb'
import VoteChart from './VoteChart'
import { Text } from 'components'

const GOV_STATE_PASSED = 'PASSED'
const GOV_STATE_REJECTED = 'REJECTED'
const GOV_STATE_DEPOSIT = 'DEPOSIT'
const GOV_STATE_VOTING = 'VOTING'

/**
 * i18n 적용 시 어떻게 분기할 것인지... 우선 API Call로 들어오는 것은 영문으로 들어오므로 체크는 그대로 가야 하는 것인지?
 * Spec 필요
 */
const getStatusColor = (c: string): string =>
  c.toUpperCase() === GOV_STATE_PASSED
    ? 'rgb(84, 147, 247)'
    : c.toUpperCase() === GOV_STATE_REJECTED
    ? 'rgb(255, 85, 97)'
    : c.toUpperCase() === GOV_STATE_DEPOSIT
    ? 'rgb(26, 153, 128)'
    : c.toUpperCase() === GOV_STATE_VOTING
    ? 'rgb(122, 111, 240)'
    : 'rgb(0,0,0)' // undefined

const ProposalItem = (proposal: ProposalItemUI): ReactElement => {
  const {
    id,
    statusTranslation,
    title,
    meta,
    deposit,
    vote,
  } = proposal
  const { navigate } = useNavigation()

  // console.log(proposal)

  const renderDetail = (
    d: { title: string; content: string },
    i: number
  ): ReactElement =>
    i === 0 ? (
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 12,
            lineHeight: 18,
            color: 'rgb(32,67,181)',
          }}
        >
          {d.title}
        </Text>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            color: 'rgb(32,67,181)',
          }}
        >
          {d.content}
        </Text>
      </View>
    ) : (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            lineHeight: 18,
            color: 'rgb(32,67,181)',
          }}
        >
          {d.title}
        </Text>
        <Text
          style={{
            fontSize: 11,
            lineHeight: 18,
            color: 'rgb(32,67,181)',
          }}
        >
          &nbsp;
        </Text>
        <Text
          style={{
            fontSize: 11,
            lineHeight: 18,
            color: 'rgb(32,67,181)',
          }}
        >
          {d.content}
        </Text>
      </View>
    )

  const footer = deposit ? (
    <View
      style={{ alignItems: 'center', marginTop: 20, marginBottom: 5 }}
    >
      <Orb
        ratio={deposit.ratio}
        completed={deposit.completed}
        size={100}
      />
      {deposit.contents.map(renderDetail)}
    </View>
  ) : vote ? (
    <View
      style={{ alignItems: 'center', marginTop: 20, marginBottom: 5 }}
    >
      <VoteChart options={vote.list} />
      {vote.contents.map(renderDetail)}
    </View>
  ) : null

  return (
    <Card onPress={(): void => navigate('Proposal', { id })}>
      {/* <Badge>{statusTranslation}</Badge> */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 2,
        }}
      >
        <Text style={{ color: getStatusColor(statusTranslation) }}>
          {statusTranslation}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              fontSize: 12,
              lineHeight: 18,
              color: 'rgb(32,67,181)',
            }}
          >
            ID:
          </Text>
          <Text
            style={{
              fontSize: 12,
              lineHeight: 18,
              color: 'rgb(32,67,181)',
            }}
          >
            &nbsp;
          </Text>
          <Text
            style={{
              fontSize: 12,
              lineHeight: 18,
              color: 'rgb(32,67,181)',
            }}
          >
            {id}
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontSize: 18,
          lineHeight: 24,
          color: 'rgb(32,67,181)',
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 11,
          lineHeight: 18,
          color: 'rgb(32,67,181)',
        }}
      >
        {meta}
      </Text>
      {footer}
    </Card>
  )
}

export default ProposalItem
