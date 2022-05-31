import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StakingUI } from '../../types'
import { StakingPage } from '../../types'
import { ValidatorListHeadings } from '../../types'
import { minus } from '../../utils'
import { toNumber } from '../../utils'

import { useDelegations, useUnbondings, useValidators } from '../../../qureys/staking'
import { useRewards } from '../../../qureys/distribution'
import { Delegation } from '@terra-money/terra.js'
import { getCalcVotingPowerRate, useTerraValidators } from '../../../qureys/Terra/TerraAPI'
import { BondStatus } from '@terra-money/terra.proto/cosmos/staking/v1beta1/staking'
import { bondStatusFromJSON } from '@terra-money/terra.proto/cosmos/staking/v1beta1/staking'
import { TerraValidator } from 'types/validator'

export default (): StakingPage => {
  const { t } = useTranslation()

  /* api */
  const { data: validators, ...validatorsState } = useValidators()
  const { data: delegations, ...delegationsState } = useDelegations()
  const { data: unbondings, ...unbondingsState } = useUnbondings()
  const { data: rewards, ...rewardsState } = useRewards()

  const { data: TerraValidators, ...TerraValidatorsState } =
    useTerraValidators()

  const activeValidators = useMemo(() => {
    if (!(validators && TerraValidators)) return null

    const calcRate = getCalcVotingPowerRate(TerraValidators)

    return validators
      .filter(({ status }) => !getIsUnbonded(status))
      .map((validator) => {
        const { operator_address } = validator

        const indexOfTerraValidator = TerraValidators.findIndex(
          (validator) => validator.operator_address === operator_address
        )

        const TerraValidator = TerraValidators[indexOfTerraValidator]

        const rank = indexOfTerraValidator + 1
        const voting_power_rate = calcRate(operator_address)

        return {
          ...TerraValidator,
          ...validator,
          rank,
          voting_power_rate,
        }
      })
      .sort(({ rank: a }, { rank: b }) => a - b)
  }, [TerraValidators, validators])

  /* render */

  /* validators */
  const headings: ValidatorListHeadings = {
    rank: {
      title: t('Page:Staking:Rank'),
    },
    moniker: {
      title: t('Page:Staking:Moniker'),
      sorter: { prop: 'description.moniker', isString: true },
    },
    votingPower: {
      title: t('Page:Staking:Voting power'),
      sorter: { prop: 'votingPower.weight' },
    },
    selfDelegation: {
      title: t('Page:Staking:Self-delegation'),
      sorter: { prop: 'selfDelegation.weight' },
    },
    commission: {
      title: t('Page:Staking:Validator commission'),
      sorter: { prop: 'commissionInfo.rate' },
    },
    uptime: {
      title: t('Page:Staking:Uptime'),
      sorter: { prop: 'upTime' },
    },
    myDelegation: {
      title: t('Page:Staking:My delegations'),
      sorter: { prop: 'myDelegation' },
    },
  }

  const renderValidators = (staking: TerraValidator[]): StakingUI => {
    return {
      headings,
      contents: staking,
    }
  }

  return Object.assign(
    {},
    {
      validatorsState,
      delegationsState,
      unbondingsState,
      rewardsState,
      TerraValidatorsState,
    },
    (
      activeValidators && delegations && unbondings && rewards
    ) && {
      personal: {
        delegations,
        unbondings,
        rewards,
        validators
      },
      ui: renderValidators(activeValidators),
    }
  )
}

/* helpers */
type SortKey = keyof Delegation
const compareWith =
  (key: SortKey) =>
  (a: Delegation, b: Delegation): number =>
    toNumber(minus(b[key] ?? '0', a[key] ?? '0'))

export const getIsBonded = (status: BondStatus) =>
  bondStatusFromJSON(BondStatus[status]) === BondStatus.BOND_STATUS_BONDED

export const getIsUnbonded = (status: BondStatus) =>
  bondStatusFromJSON(BondStatus[status]) === BondStatus.BOND_STATUS_UNBONDED
