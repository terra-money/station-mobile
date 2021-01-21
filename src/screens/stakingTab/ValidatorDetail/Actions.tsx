import React, { ReactElement } from 'react'
import { ValidatorUI, format } from 'use-station/src'
import Number from 'components/Number'
import Icon from 'components/Icon'
import ButtonWithAuth from 'components/ButtonWithAuth'
import { Text } from 'components'
import DelegationTooltip from './DelegationTooltip'
// import Delegate from '../../post/Delegate'
// import Withdraw from '../../post/Withdraw'

const Actions = (v: ValidatorUI): ReactElement => {
  const { delegate, undelegate, withdraw } = v
  const { myDelegations, myActionsTable, myRewards } = v

  /* tx */
  const open = {
    delegate: ({}: { undelegate?: boolean }): void => {
      // open(delegate)
    },
    withdraw: (): void => {
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
        onPress={(): void => open.delegate({})}
      />
      <ButtonWithAuth
        {...undelegate}
        onPress={(): void => open.delegate({ undelegate: true })}
      />

      <Text>{myRewards.title}</Text>
      <Number {...myRewards.display} fontSize={18} estimated />

      <ButtonWithAuth
        {...withdraw}
        onPress={(): void => open.withdraw()}
      />
    </>
  )
}

export default Actions
