import React from 'react'
import { Text } from 'react-native'
import { ValidatorUI, format } from '@terra-money/use-native-station'
import Number from '../../components/Number'
import Icon from '../../components/Icon'
import ButtonWithAuth from '../../components/ButtonWithAuth'
import DelegationTooltip from '../staking/DelegationTooltip'
// import Delegate from '../../post/Delegate'
// import Withdraw from '../../post/Withdraw'

const Actions = (v: ValidatorUI) => {
  const { delegate, undelegate, withdraw } = v
  const { myDelegations, myActionsTable, myRewards } = v

  /* tx */
  const open = {
    delegate: ({}: { undelegate?: boolean }) => {
      // open(delegate)
    },
    withdraw: () => {
      // myRewards.amounts && open(withdraw)
    },
  }

  /* render */
  const content = myActionsTable && (
    <DelegationTooltip {...myActionsTable} />
  )
  const myDelegation =
    myDelegations.display ??
    format.display({ amount: '0', denom: 'uluna' })

  return (
    <>
      <Text>{myDelegations.title}</Text>
      {content ? (
        <>
          <Number {...myDelegation} fontSize={18} />
          <Icon name="arrow_drop_down" />
          <Text>{content}</Text>
        </>
      ) : (
        <Number {...myDelegation} fontSize={18} />
      )}

      <ButtonWithAuth
        {...delegate}
        onPress={() => open.delegate({})}
      />
      <ButtonWithAuth
        {...undelegate}
        onPress={() => open.delegate({ undelegate: true })}
      />

      <Text>{myRewards.title}</Text>
      <Number {...myRewards.display} fontSize={18} estimated />

      <ButtonWithAuth {...withdraw} onPress={() => open.withdraw()} />
    </>
  )
}

export default Actions
