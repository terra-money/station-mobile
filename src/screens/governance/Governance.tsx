import React from 'react'
import { useMenu } from '@terra-money/use-native-station'
import { useGovernance } from '@terra-money/use-native-station'
import { ProposalItemUI } from '@terra-money/use-native-station'
import Page from '../../components/Page'
import Info from '../../components/Info'
import ProposalItem from './ProposalItem'

const params = { status: '' }

const Governance = () => {
  const { Governance: title } = useMenu()
  const { ui, ...api } = useGovernance(params)

  const renderItem = (item: ProposalItemUI) => (
    <ProposalItem {...item} key={item.id} />
  )

  return (
    <Page {...api} title={title}>
      {ui?.message ? (
        <Info card>{ui.message}</Info>
      ) : (
        <>{ui?.list?.map(renderItem)}</>
      )}
    </Page>
  )
}

export default Governance
