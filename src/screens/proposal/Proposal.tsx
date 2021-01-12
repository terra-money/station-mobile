import React from 'react'
import { useRoute, RouteProp } from '@react-navigation/native'
import {
  ProposalUI,
  useProposal,
  useMenu,
  useAuth,
} from '@terra-money/use-native-station'

import { GovernanceRouteParams } from '../../types/navigation'
import Page from '../../components/Page'
import ProposalHeader from './ProposalHeader'
import ProposalFooter from './ProposalFooter'
import Deposit from './Deposit'
import Votes from './Votes'
import NotVoted from './NotVoted'
// import VotesTable from '../../tables/VotesTable'
// import Depositors from '../../tables/Depositors'

type ValidatorRouteProp = RouteProp<GovernanceRouteParams, 'Proposal'>

const Proposal = () => {
  const { Proposal: title } = useMenu()
  const { params } = useRoute<ValidatorRouteProp>()
  const { id } = params
  const { user } = useAuth()
  const { ui, ...api } = useProposal(id, user)

  const render = (ui: ProposalUI) => {
    const { vote, deposit, tallying } = ui

    return (
      <>
        <ProposalHeader {...ui} />

        {vote && (
          <>
            <Votes {...vote} />
            {vote.notVoted && <NotVoted {...vote.notVoted} />}
            {/* <VotesTable id={id} count={vote.count} /> */}
          </>
        )}

        {deposit && (
          <>
            <Deposit {...deposit} />
            {/* <Depositors id={id} /> */}
          </>
        )}

        {tallying && <ProposalFooter {...tallying} />}
      </>
    )
  }

  return (
    <Page {...api} title={title}>
      {ui && render(ui)}
    </Page>
  )
}

export default Proposal
