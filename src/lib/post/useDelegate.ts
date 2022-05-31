import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  PostPage,
  ConfirmProps,
  BankData,
} from '../types'
import { CoinItem, User, Field, FieldElement } from '../types'
import { format } from '../utils'
import { toAmount, toInput } from '../utils/format'
import useBank from '../api/useBank'
import useForm from '../hooks/useForm'
import validateForm from './validateForm'
import { isDelegatable, isFeeAvailable } from './validateConfirm'
import { getFeeDenomList } from './validateConfirm'
import {
  Coin,
  Validator,
  Delegation,
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
  AccAddress,
} from '@terra-money/terra.js'
import { QueryObserverBaseResult } from 'react-query'
import { useIsClassic } from 'lib'
import { getFindMoniker } from '../../qureys/staking'

interface Values {
  from: string
  input: string
}

interface Props {
  validatorAddress: string
  validators: Validator[]
  delegations: Delegation[]
  delegationsState: QueryObserverBaseResult<Delegation, Error>
  type: DelegateType
}

export enum DelegateType {
  D = 'Delegate',
  R = 'Redelegate',
  U = 'Undelegate',
}

const denom = 'uluna'

export default (
  user: User,
  { validatorAddress, validators, delegations, delegationsState, type }: Props
): PostPage => {
  const isUndelegation = type === DelegateType.U
  const isRedelegation = type === DelegateType.R

  const { t } = useTranslation()
  const v = validateForm(t)
  const isClassic = useIsClassic()

  /* ready */
  const { address } = user
  const { data: bank, loading, error } = useBank(user)
  const findMoniker = getFindMoniker(validators)

  const delegationsOptions = delegations.filter(
    ({ validator_address }) =>
      type !== DelegateType.R || validator_address !== validatorAddress
  )
  const findDelegation = (address: AccAddress) =>
    delegationsOptions.find(
      ({ validator_address }) => validator_address === address
    )

  /* max */
  const getMax = (address: string): CoinItem => {
    const amount = findDelegation(address)?.balance?.amount
      ?? (
        isClassic ?
          bank?.balance?.find(a => a.denom === 'uluna')?.available :
          bank?.balance?.find(a => a.denom === 'uluna')?.amount
      )

    return { amount: amount ?? '0', denom }
  }

  /* form */
  const validate = ({
    input,
    from,
  }: Values): {
    input: string
    from: string
  } => ({
    input: v.input(input, {
      max: toInput(
        getMax(isUndelegation ? validatorAddress : from).amount
      ),
    }),
    from:
      type === DelegateType.R && !from ? 'Source is required' : '',
  })

  /*
  Delegation:   from = address(user) / to = validatorAddress
  Redelegation: from = address(src)  / to = validatorAddress
  Undelegation: from = address(user) / to = validatorAddress
  */

  const initial = { input: '', from: isRedelegation ? '' : address }
  const [submitted, setSubmitted] = useState(false)
  const form = useForm<Values>(initial, validate)
  const {
    values,
    setValue,
    invalid,
    getDefaultProps,
    getDefaultAttrs,
  } = form
  const { input, from } = values
  const amount = toAmount(input)

  const moniker = findMoniker(validatorAddress)

  /* render */
  const unit = format.denom(denom)
  const hasSources = !!delegationsOptions?.length
  const sourceLength = hasSources
    ? delegationsOptions!.length
    : t('Page:Bank:My wallet')

  const fromField = {
    ...getDefaultProps('from'),
    label: t('Post:Staking:Source ({{length}})', {
      length: sourceLength,
    }),
    element: (hasSources ? 'select' : 'input') as FieldElement,
    attrs: {
      ...getDefaultAttrs('from'),
      readOnly: !hasSources,
    },
    options: !hasSources
      ? undefined
      : [
          {
            value: '',
            children: 'Choose a validator',
            disabled: true,
          },
          ...delegationsOptions!.map(({ validator_address }) => ({
            value: validator_address,
            children: findMoniker(validator_address),
          })),
        ],
  }

  const inputField = {
    ...getDefaultProps('input'),
    label: t('Common:Tx:Amount'),
    button: {
      label: t('Common:Account:Available'),
      display: format.display(
        getMax(isUndelegation ? validatorAddress : from)
      ),
      attrs: {
        onClick: (): void =>
          setValue(
            'input',
            toInput(
              getMax(isUndelegation ? validatorAddress : from).amount
            )
          ),
      },
    },
    attrs: {
      ...getDefaultAttrs('input'),
      type: 'number' as const,
      placeholder: '0',
      autoFocus: true,
    },
    unit,
  }

  const fields: Field[] = isRedelegation
    ? [fromField, inputField]
    : [inputField]

  const getConfirm = (bank: BankData): ConfirmProps => {
    const coin = format.coin({ amount, denom })
    const display = format.display({ amount, denom })
    const contents = [
      { name: t('Common:Tx:Amount'), displays: [display] },
    ]
    const feeDenom = { list: getFeeDenomList(bank.balance) }
    const cancel = (): void => setSubmitted(false)

    return {
      [DelegateType.D]: {
        contents,
        feeDenom,
        cancel,
        msgs: [
          new MsgDelegate(
            from,
            validatorAddress,
            new Coin(denom, amount)
          ),
        ],
        validate: (fee: CoinItem): boolean =>
          isDelegatable({ amount, denom, fee }, bank.balance, isClassic) &&
          isFeeAvailable(fee, bank.balance, isClassic),
        submitLabels: [
          t('Post:Staking:Delegate'),
          t('Post:Staking:Delegating...'),
        ],
        message: t('Post:Staking:Delegated {{coin}} to {{moniker}}', {
          coin,
          moniker,
        }),
        warning: t(
          'Post:Staking:Remember to leave a small amount of tokens undelegated, as subsequent transactions (e.g. redelegation) require fees to be paid.'
        ),
      },
      [DelegateType.R]: {
        contents,
        feeDenom,
        cancel,
        msgs: [
          new MsgBeginRedelegate(
            address,
            from,
            validatorAddress,
            new Coin(denom, amount)
          ),
        ],
        validate: (fee: CoinItem): boolean =>
          isFeeAvailable(fee, bank.balance, isClassic),
        submitLabels: [
          t('Post:Staking:Redelegate'),
          t('Post:Staking:Redelegating...'),
        ],
        message: t(
          'Post:Staking:Redelegated {{coin}} to {{moniker}}',
          {
            coin,
            moniker,
          }
        ),
        warning:
          'Redelegation from the recipient validator will be blocked for 21 days after this transaction.',
      },
      [DelegateType.U]: {
        contents,
        feeDenom,
        cancel,
        msgs: [
          new MsgUndelegate(
            from,
            validatorAddress,
            new Coin(denom, amount)
          ),
        ],
        validate: (fee: CoinItem): boolean =>
          isFeeAvailable(fee, bank.balance, isClassic),
        submitLabels: [
          t('Post:Staking:Undelegate'),
          t('Post:Staking:Undelegating...'),
        ],
        message: t(
          'Post:Staking:Undelegated {{coin}} from {{moniker}}',
          {
            coin,
            moniker,
          }
        ),
        warning: t(
          'Post:Staking:Undelegation takes 21 days to complete. You would not get rewards in the meantime.'
        ),
      },
    }[type]
  }

  const disabled = invalid

  const formUI = {
    fields,
    disabled,
    title: t('Post:Staking:' + type),
    submitLabel: t('Common:Form:Next'),
    onSubmit: disabled ? undefined : (): void => setSubmitted(true),
  }

  return {
    error: error || delegationsState?.error,
    loading: loading || delegationsState?.isLoading,
    submitted,
    form: formUI,
    confirm: bank && getConfirm(bank),
  }
}
