import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import {
  useStaking,
  useAuth,
  User,
  StakingData
} from 'lib'
import { StackScreenProps } from '@react-navigation/stack'
import { Validator } from '@terra-money/terra.js'

import { navigationHeaderOptions } from 'components/layout/Header'
import Body from 'components/layout/Body'

import { RootStackParams } from 'types'

import Rewards from './Rewards'
import Delegated from './Delegated'
import UnDelegated from './UnDelegated'
import { Loading, Text } from 'components'
import { useTerraValidators } from '../../qureys/Terra/TerraAPI'
import { getIsUnbonded } from 'lib/pages/staking/useStaking'

type Props = StackScreenProps<RootStackParams, 'Staking'>

const Render = ({
  user,
  personal,
}: {
  user?: User
  personal: StakingData
}): ReactElement => {
  const { validators, rewards, delegations, unbondings } = personal
  const { data: TerraValidators } = useTerraValidators()

  const activeValidators = useMemo(() => {
    if (!(validators && TerraValidators)) return null

    return validators
      .filter(({ status }) => !getIsUnbonded(status))
      .map((validator) => {
        const { operator_address } = validator

        const indexOfTerraValidator = TerraValidators.findIndex(
          (validator) => validator.operator_address === operator_address
        )

        const TerraValidator = TerraValidators[indexOfTerraValidator]

        return {
          ...TerraValidator,
          ...validator,
        }
      })
  }, [TerraValidators, validators])

  const findMoniker = ({
    address,
  }: {
    address: string
  }): Validator | undefined =>
    activeValidators.find((x) => x.operator_address === address)

  return (
    <>
      {rewards && user && <Rewards personal={personal} user={user} />}
      {delegations && <Delegated personal={personal} findMoniker={findMoniker} />}
      {unbondings && <UnDelegated personal={personal} findMoniker={findMoniker} />}
    </>
  )
}

const StakingPersonal = ({ navigation }: Props): ReactElement => {
  const { user } = useAuth()
  const { personal, delegationsState, unbondingsState, rewardsState } = useStaking()
  const [loadingComplete, setLoadingComplete] = useState(false)

  const [refreshingKey, setRefreshingKey] = useState(0)
  const refreshPage = async (): Promise<void> => {
    setRefreshingKey((ori) => ori + 1)
    delegationsState.refetch()
    unbondingsState.refetch()
    rewardsState.refetch()
  }

  useEffect(() => {
    if (delegationsState.isLoading === false) {
      setLoadingComplete(true)
    }
  }, [delegationsState.isLoading])

  useEffect(() => {
    let unsubscribe
    if (loadingComplete) {
      unsubscribe = navigation.addListener('focus', () => {
        refreshPage()
      })
    }
    return unsubscribe
  }, [loadingComplete])

  return (
    <Body
      theme={'sky'}
      containerStyle={{ paddingTop: 20 }}
      scrollable={loadingComplete}
      onRefresh={refreshPage}
    >
      {loadingComplete ? (
        personal && (
          <Render
            user={user}
            personal={personal}
            key={refreshingKey}
          />
        )
      ) : (
        <Loading
          style={{
            flex: 1,
            height: '100%',
            justifyContent: 'center',
          }}
        />
      )}
    </Body>
  )
}

StakingPersonal.navigationOptions = navigationHeaderOptions({
  theme: 'white',
  headerTitle: (): ReactElement => (
    <Text
      style={{ fontSize: 16, lineHeight: 24, letterSpacing: 0 }}
      fontType="bold"
    >
      {'Staking details'}
    </Text>
  ),
})

export default StakingPersonal
