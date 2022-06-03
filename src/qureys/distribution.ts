import { useQuery } from 'react-query'
import BigNumber from 'bignumber.js'
import { Coins, Rewards, ValAddress } from '@terra-money/terra.js'
import { has } from 'utils/num'
import { sortCoins } from 'utils/coin'
import { queryKey, RefetchOptions } from './query'
import useLCDClient from 'lib/api/useLCD'
import { useValidators } from './staking'
import { CalcValue } from './oracle'
import { useAuth } from 'lib/contexts/AuthContext'

export const useRewards = () => {
  const { user } = useAuth()
  const lcd = useLCDClient()

  return useQuery(
    [queryKey.distribution.rewards, user?.address],
    async () => {
      if (!user?.address) return { total: new Coins(), rewards: {} }
      return await lcd.distribution.rewards(user?.address)
    },
    { ...RefetchOptions.INFINITY }
  )
}

export const useCommunityPool = () => {
  const lcd = useLCDClient()

  return useQuery(
    [queryKey.distribution.communityPool],
    () => lcd.distribution.communityPool(),
    { ...RefetchOptions.INFINITY }
  )
}

/* commission */
export const useValidatorCommission = () => {
  const lcd = useLCDClient()
  const { user } = useAuth()

  return useQuery(
    [queryKey.distribution.validatorCommission],
    async () => {
      if (!user?.address) return new Coins()
      const validatorAddress = ValAddress.fromAccAddress(user?.address)
      return await lcd.distribution.validatorCommission(validatorAddress)
    },
    { ...RefetchOptions.DEFAULT }
  )
}

export const useWithdrawAddress = () => {
  const lcd = useLCDClient()
  const { user } = useAuth()

  return useQuery(
    [queryKey.distribution.withdrawAddress],
    async () => {
      if (!user?.address) return
      return await lcd.distribution.withdrawAddress(user?.address)
    },
    { ...RefetchOptions.DEFAULT }
  )
}

/* hooks */
export const useConnectedMoniker = () => {
  const { user } = useAuth()
  const { data: validators } = useValidators()

  if (!(user?.address && validators)) return

  const validatorAddress = ValAddress.fromAccAddress(user?.address)
  const validator = validators.find(
    ({ operator_address }) => operator_address === validatorAddress
  )

  if (!validator) return

  return validator.description.moniker
}

/* helpers */
export const calcRewardsValues = (
  rewards: Rewards,
  currency: Denom,
  calcValue: CalcValue
) => {
  const calc = (coins: Coins) => {
    const list = sortCoins(coins, currency).filter(({ amount }) => has(amount))
    const sum = BigNumber.sum(
      ...list.map((item) => calcValue(item) ?? 0)
    ).toString()

    return { sum, list }
  }

  const total = calc(rewards.total)
  const byValidator = Object.entries(rewards.rewards)
    .map(([address, coins]) => ({ ...calc(coins), address }))
    .filter(({ sum }) => has(sum))
    .sort(({ sum: a }, { sum: b }) => Number(b) - Number(a))

  return { total, byValidator }
}
