import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'
import { MsgExecuteContract, MsgSend } from '@terra-money/terra.js'
import { Coin } from '@terra-money/terra.js'
import { BankData, Whitelist } from '../types'
import { PostPage, CoinItem, User, Field } from '../types'
import { ConfirmContent, ConfirmProps } from '../types'
import { format, find } from '../utils'
import { gt, max, minus } from '../utils/math'
import { toAmount, toInput } from '../utils/format'
import { TokenBalanceQuery } from '../cw20/useTokenBalance'
import useBank from '../api/useBank'
import useForm from '../hooks/useForm'
import validateForm from './validateForm'
import {
  isAvailable,
  getFeeDenomList,
  isFeeAvailable,
} from './validateConfirm'
import { useCalcFee } from './txHelpers'
import { useDenomTrace } from 'hooks/useDenomTrace'
import { UTIL } from 'consts'
import { useIsClassic } from 'lib'
import useIBCWhitelist from 'lib/hooks/useIBCWhitelist'

interface Values {
  to: string
  input: string
  memo: string
}

export default (
  user: User,
  denom: string,
  tokenBalance: TokenBalanceQuery
): PostPage => {
  const { t } = useTranslation()
  const { data: bank, loading: bankLoading, error } = useBank(user)
  const { list, isLoading: tokenLoading, tokens } = tokenBalance
  const loading = bankLoading || tokenLoading
  const v = validateForm(t)
  const isIbcDenom = UTIL.isIbcDenom(denom)
  const { data: denomTrace } = useDenomTrace(denom)
  const ibcDenom = denomTrace?.base_denom
  const isClassic = useIsClassic()
  const ibcWhiteList = useIBCWhitelist()
  const thisIBC = ibcWhiteList?.whitelist?.[denom.replace('ibc/', '')]

  /* form */
  const getBalance = (): string =>
    (UTIL.isNativeDenom(denom) || isIbcDenom
      ? find(`${denom}:${isClassic ? 'available' : 'amount'}`, bank?.balance)
      : list?.find(({ token }) => token === denom)?.balance) ?? '0'

  const thisDecimals = useMemo(
    () => isIbcDenom ? thisIBC?.decimals : tokens?.[denom]?.decimals,
    [thisIBC, tokens?.[denom], isIbcDenom]
  )

  const validate = ({
    input,
    to,
    memo,
  }: Values): {
    to: string
    input: string
    memo: string
  } => ({
    to: v.address(to),
    input: v.input(
      input,
      { max: toInput(getBalance(), thisDecimals) },
      thisDecimals
    ),
    memo:
      v.length(memo, { max: 256, label: t('Common:Tx:Memo') }) ||
      v.includes(memo, '<') ||
      v.includes(memo, '>'),
  })

  const initial = { to: '', input: '', memo: '' }
  const form = useForm<Values>(initial, validate)
  const { values, setValue, invalid } = form
  const { getDefaultProps, getDefaultAttrs } = form
  const { to, input, memo } = values
  const amount = toAmount(input, thisDecimals)

  const [submitted, setSubmitted] = useState(false)
  const calcFee = useCalcFee()
  const balance = getBalance()

  const calculatedMaxAmount = balance

  const maxAmount =
    bank?.balance?.length === 1 && calcFee
      ? max([
          minus(
            calculatedMaxAmount,
            calcFee.feeFromGas('150000', denom)
          ),
          0,
        ])
      : calculatedMaxAmount

  const unit = format.denom(isIbcDenom ? (thisIBC?.symbol || ibcDenom) : denom, tokens)

  /* render */
  const fields: Field[] = [
    {
      ...getDefaultProps('to'),
      label: t('Post:Send:Send to'),
      attrs: {
        ...getDefaultAttrs('to'),
        placeholder: `Terra address`,
        autoFocus: true,
      },
    },
    {
      ...getDefaultProps('input'),
      label: t('Common:Tx:Amount'),
      button: {
        label: t('Common:Account:Available'),
        display: format.display(
          { amount: maxAmount, denom },
          thisDecimals
        ),
        attrs: {
          onClick: (): void =>
            setValue(
              'input',
              toInput(maxAmount, thisDecimals)
            ),
        },
      },
      attrs: {
        ...getDefaultAttrs('input'),
        type: 'number',
        placeholder: '0',
      },
      unit,
    },
    {
      ...getDefaultProps('memo'),
      label: `${t('Common:Tx:Memo')} (${t('Common:Form:Optional')})`,
      attrs: {
        ...getDefaultAttrs('memo'),
        placeholder: t('Post:Send:Input memo'),
      },
    },
  ]

  const isInvalidAmount =
    gt(amount, maxAmount) ||
    _.isEmpty(amount) ||
    _.toNumber(amount) <= 0
  const disabled = invalid || isInvalidAmount

  const formUI = {
    title: t('Post:Send:Send {{unit}}', { unit }),
    fields,
    disabled,
    submitLabel: t('Common:Form:Next'),
    onSubmit: disabled ? undefined : (): void => setSubmitted(true),
  }

  const contents: ConfirmContent[] = ([] as ConfirmContent[])
    .concat([
      {
        name: t('Post:Send:Send to'),
        text: to,
      },
      {
        name: t('Common:Tx:Amount'),
        displays: [
          UTIL.isIbcDenom(denom)
            ? {
                value: format.amount(amount),
                unit: format.denom(ibcDenom) || ibcDenom || denom,
              }
            : UTIL.isNativeDenom(denom)
            ? format.display({ amount, denom })
            : { value: input, unit: tokens?.[denom].symbol ?? '' },
        ],
      },
    ])
    .concat(memo ? { name: t('Common:Tx:Memo'), text: memo } : [])

  const getConfirm = (
    bank: BankData,
    whitelist: Whitelist
  ): ConfirmProps => ({
    msgs:
      UTIL.isNativeDenom(denom) || UTIL.isIbcDenom(denom)
        ? [new MsgSend(user.address, to, [new Coin(denom, amount)])]
        : [
            new MsgExecuteContract(user.address, denom, {
              transfer: { recipient: to, amount },
            }),
          ],
    memo,
    contents,
    feeDenom: { list: getFeeDenomList(bank.balance) },
    validate: (fee: CoinItem): boolean =>
      UTIL.isNativeDenom(denom)
        ? isAvailable(
            { amount, denom, fee },
            bank.balance,
            isClassic
          )
        : isFeeAvailable(fee, bank.balance, isClassic),
    submitLabels: [t('Post:Send:Send'), t('Post:Send:Sending...')],
    message: t('Post:Send:Sent {{coin}} to {{address}}', {
      coin: format.coin(
        { amount, denom: ibcDenom || denom },
        whitelist?.[denom]?.decimals,
        undefined,
        whitelist
      ),
      address: to,
    }),
    warning: [
      t(
        'Post:Send:Please double check if the above transaction requires a memo'
      ),
    ],
    cancel: (): void => setSubmitted(false),
  })

  return {
    error,
    loading,
    submitted,
    form: formUI,
    confirm: bank ? getConfirm(bank, tokens ?? {}) : undefined,
  }
}
