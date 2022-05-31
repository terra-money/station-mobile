import { MsgWithdrawDelegatorReward } from '@terra-money/terra.js'
import { useTranslation } from 'react-i18next'
import { User, WithdrawProps, PostPage } from '../types'
import useBank from '../api/useBank'
import { isFeeAvailable, getFeeDenomList } from './validateConfirm'
import { useIsClassic } from 'lib'

export default (user: User, props: WithdrawProps): PostPage => {
  const { amounts, validators } = props
  const { t } = useTranslation()
  const { data: bank, loading, error } = useBank(user)
  const { address: to } = user
  const isClassic = useIsClassic()

  const msgs = validators?.map(
    (addr) => new MsgWithdrawDelegatorReward(to, addr)
  )

  return {
    error,
    loading,
    submitted: true,
    confirm: bank && {
      msgs,
      contents: [{ name: t('Common:Tx:Amount'), displays: amounts }],
      feeDenom: { list: getFeeDenomList(bank.balance) },
      validate: (fee): boolean => isFeeAvailable(fee, bank.balance, isClassic),
      submitLabels: [
        t('Post:Staking:Withdraw'),
        t('Post:Staking:Withdrawing...'),
      ],
      message: t('Post:Staking:Withdrew to {{to}}', { to }),
    },
  }
}
