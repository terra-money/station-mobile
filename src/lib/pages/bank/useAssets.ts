import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AssetsPage,
  AssetsUI,
  BankData,
  BankDataV2,
  DisplayCoin,
  Schedule,
  TokenBalance,
  User,
} from '../../types'
import { format } from '../../utils'
import { percent, gte } from '../../utils/math'
import useBank from '../../api/useBank'
import useTokenBalance from '../../cw20/useTokenBalance'
import { UTIL } from 'consts'
import { useIsClassic } from 'lib/contexts/ConfigContext'
import { VestingType, VestingTypes } from '../../../qureys/vesting'

const SMALL = '1000000'

interface Config {
  hideSmall?: boolean
}

export default (user: User, config?: Config): AssetsPage => {
  const { t } = useTranslation()
  const bank = useBank(user)
  const isClassic = useIsClassic()
  const tokenBalances = useTokenBalance(user.address)
  const [hideSmall, setHideSmall] = useState<boolean>(
    config?.hideSmall !== undefined ? config.hideSmall : false
  )

  const load = (): void => {
    bank.execute()
    tokenBalances?.refetch()
  }

  const render = (
    { balance, vesting }: BankData,
    tokenList?: TokenBalance[]
  ): AssetsUI => ({
    card:
      !balance?.length && !tokenList?.length && !vesting?.length
        ? {
            title: t('Page:Bank:Wallet empty'),
            content: t(
              "Page:Bank:This wallet doesn't hold any coins yet"
            ),
          }
        : !balance?.length && !vesting?.length && tokenList?.length
        ? {
            title: t('Page:Bank:Wallet empty'),
            content:
              'This wallet does not hold any native tokens, so the transaction could not be processed.',
          }
        : undefined,
    available: !balance?.length
      ? undefined
      : {
          title: 'Terra Native',
          list: balance
            .filter(
              ({ available }) => !hideSmall || gte(available, SMALL)
            )
            .filter(({ denom }) => !UTIL.isIbcDenom(denom))
            .map(({ available, denom }) => ({
              denom,
              display: format.display({ amount: available, denom }),
            })),
          hideSmall: {
            label: t('Page:Bank:Hide small balances'),
            checked: hideSmall,
            toggle: (): void => setHideSmall((v) => !v),
          },
          send: t('Post:Send:Send'),
        },
    ibc: !balance?.filter(({ denom }) => UTIL.isIbcDenom(denom)).length
      ? undefined
      : {
          title: 'IBC Tokens',
          list: balance
            .filter(({ denom }) => UTIL.isIbcDenom(denom))
            .map(({ available, denom }) => {
              return {
                denom,
                display: {
                  value: format.amount(available),
                  unit: denom,
                },
              }
            }),
          send: t('Post:Send:Send'),
        },
    tokens: {
      title: 'CW20 Tokens',
      list:
        tokenList?.map(
          ({ token, symbol, icon, balance, decimals }) => {
            const display = {
              value: format.amount(balance, decimals),
              unit: symbol,
            }

            return { icon, token, display }
          }
        ) ?? [],
      send: t('Post:Send:Send'),
    },
    vesting: (
      !vesting?.length
      ? undefined
      : {
          title: t('Page:Bank:Vesting schedule'),
          desc: t(
            'Page:Bank:This displays your investment with Terra. Vested Luna can be delegated in the meantime.'
          ),
          list: vesting.map(({ total, denom, schedules }) => ({
            display: format.display({ amount: total, denom }),
            schedule: schedules.map((item) =>
              getSchedule(item, denom)
            ),
          })),
        }
    ),
  })

  const renderV2 = (
    { balance, vesting }: BankDataV2,
    tokenList?: TokenBalance[]
  ): AssetsUI => ({
    card:
      !balance?.length && !tokenList?.length && !vesting?.length
        ? {
          title: t('Page:Bank:Wallet empty'),
          content: t(
            "Page:Bank:This wallet doesn't hold any coins yet"
          ),
        }
        : !balance?.length && !vesting?.length && tokenList?.length
          ? {
            title: t('Page:Bank:Wallet empty'),
            content:
              'This wallet does not hold any native tokens, so the transaction could not be processed.',
          }
          : undefined,
    available: !balance?.length
      ? undefined
      : {
        title: 'Terra Native',
        list: balance
          .filter(
            ({ amount }) => !hideSmall || gte(amount, SMALL)
          )
          .filter(({ denom }) => !UTIL.isIbcDenom(denom))
          .map(({ amount, denom }) => ({
            denom,
            display: format.display({ amount, denom }),
          })),
        hideSmall: {
          label: t('Page:Bank:Hide small balances'),
          checked: hideSmall,
          toggle: (): void => setHideSmall((v) => !v),
        },
        send: t('Post:Send:Send'),
      },
    ibc: !balance?.filter(({ denom }) => UTIL.isIbcDenom(denom)).length
      ? undefined
      : {
        title: 'IBC Tokens',
        list: balance
          ?.filter(({ denom }) => UTIL.isIbcDenom(denom))
          .map(({ denom, amount }) => {
            return {
              denom,
              display: {
                value: format.amount(amount),
                unit: denom,
              },
            }
          }),
        send: t('Post:Send:Send'),
      },
    tokens: {
      title: 'CW20 Tokens',
      list:
        tokenList?.map(
          ({ token, symbol, icon, balance, decimals }) => {
            const display = {
              value: format.amount(balance, decimals),
              unit: symbol,
            }

            return { icon, token, display }
          }
        ) ?? [],
      send: t('Post:Send:Send'),
    },
    vesting: (
      !vesting?.length
        ? undefined
        : {
          title: t('Page:Bank:Vesting schedule'),
          desc: t(
            'Page:Bank:This displays your investment with Terra. Vested Luna can be delegated in the meantime.'
          ),
          list: vesting.map(({ total, denom, schedules, type }) => ({
            display: format.display({ amount: total, denom }),
            schedule: schedules.map((item) =>
              getSchedule(item, denom, type)
            ),
          })),
        }
    ),
  })

  const getSchedule = (
    schedule: Schedule,
    denom: string,
    type?: VestingType
  ): {
    released: boolean
    releasing: boolean
    percent: string
    display: DisplayCoin
    status: string
    duration: string
    width: string
  } => {
    if (type && type === VestingTypes.Delayed) {
      const { amount, endTime } = schedule
      const now = new Date().getTime()
      const released = endTime < now
      const releasing = now < endTime

      return {
        released,
        releasing,
        percent: '',
        display: format.display({ amount, denom }),
        status: released
          ? t('Page:Bank:Released')
          : t('Page:Bank:Release on'),
        duration: `${toISO(endTime)}`,
        width: percent(released ? 100 : 0, 0),
      }
    } else {
      const { amount, startTime, endTime, ratio = 0, freedRate = 0 } = schedule
      const now = new Date().getTime()
      const released = endTime < now
      const releasing = startTime < now && now < endTime

      return {
        released,
        releasing,
        percent: percent(ratio),
        display: format.display({ amount, denom }),
        status: released
          ? t('Page:Bank:Released')
          : releasing
          ? t('Page:Bank:Releasing')
          : t('Page:Bank:Release on'),
        duration: [startTime, endTime]
          .map((t) => `${toISO(t)}`)
          .join(' ~ '),
        width: percent(freedRate, 0),
      }
    }

  }

  return Object.assign(
    { setHideSmall, load },
    bank,
    { loading: bank.loading || tokenBalances.isLoading },
    bank.data && {
      ui: isClassic ? render(bank.data, tokenBalances.list) :
        renderV2(bank.data, tokenBalances.list)
    }
  )
}

/* helper */
const toISO = (date: number): string =>
  format.date(new Date(date).toISOString())
