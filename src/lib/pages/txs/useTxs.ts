import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isTxError } from '@terra-money/terra.js'
import _ from 'lodash'

import { TxsPage, User, Tx, TxUI } from '../../types'
import { format } from '../../utils'
import useFCD from '../../api/useFCD'
import { useConfig } from '../../contexts/ConfigContext'
import useFinder from '../../hooks/useFinder'
import useParseTxText from './useParseTxText'
import {
  createActionRuleSet,
  createLogMatcherForActions,
  getTxCanonicalMsgs,
  Action,
} from '@terra-money/log-finder-ruleset'

type Response = {
  txs: Tx[]
  limit: number
  next: number
}

const TXS_MAX_ALLOWED_SIZE = 300 * 1024

export default ({ address }: User): TxsPage => {
  const { t } = useTranslation()
  const getLink = useFinder()
  const { chain } = useConfig()
  const { name: currentChain } = chain.current
  const parseTxText = useParseTxText()

  /* api */
  const [list, setList] = useState<TxUI[]>([])
  const [isParse, setParse] = useState<boolean>(false)
  const [txs, setTxs] = useState<Tx[]>([])
  const [next, setNext] = useState<number>()
  const [offset, setOffset] = useState<number>()
  const [done, setDone] = useState(false)

  const url = '/v1/txs'
  const params = { account: address, offset }
  const response = useFCD<Response>({ url, params })
  const { data } = response

  useEffect(() => {
    if (data) {
      setTxs(data.txs)
      setNext(data.next)
      setDone(data.txs.length < data.limit)
      setParse(true)
    }
  }, [data])

  const more =
    list.length && !done ? (): void => setOffset(next) : undefined

  /* parse */
  const ruleset = createActionRuleSet(currentChain)
  const logMatcher = createLogMatcherForActions(ruleset)

  const getCanonicalMsgs = (tx: Tx): Action[] => {
    const matchedMsg = getTxCanonicalMsgs(
      JSON.stringify(tx),
      logMatcher
    )

    if (matchedMsg) {
      const flatted = matchedMsg
        .map((matchedLog) =>
          matchedLog.map(({ transformed }) => transformed)
        )
        .flat(2)

      const filtered: Action[] = []
      _.forEach(flatted, (x) => {
        if (x) {
          filtered.push(x)
        }
      })

      return filtered
    }

    return []
  }

  useEffect(() => {
    const promises = txs.map(async (txItem) => {
      const { txhash, chainId, timestamp, raw_log, tx } = txItem
      const { fee, memo } = tx.value

      const makeTxUi = (
        messages: {
          tag: string
          summary: string[]
          success: boolean
        }[]
      ): TxUI => {
        return {
          link: getLink({
            network: chainId,
            q: 'tx',
            v: txhash,
          }),
          hash: txhash,
          date: format.date(timestamp, { toLocale: true }),
          messages,
          details: [
            {
              title: t('Common:Tx:Tx fee'),
              content: fee.amount
                ?.map((coin) => format.coin(coin))
                .join(', '),
            },
            { title: t('Common:Tx:Memo'), content: memo },
          ].filter(({ content }) => !!content),
        }
      }

      if (JSON.stringify(txItem)?.length > TXS_MAX_ALLOWED_SIZE) {
        return makeTxUi([
          {
            tag: 'Unknown',
            summary: [
              'Message too long, refer to finder for details',
            ],
            success: !isTxError(txItem),
          },
        ])
      }

      const success = !isTxError(txItem)
      const msgs = getCanonicalMsgs(txItem)
      const successMessage =
        msgs.length > 0
          ? await Promise.all(
              msgs.map(async (msg) => {
                const tag = msg.msgType
                  .split('/')[1]
                  .replace(/-/g, ' ')
                const summary = await Promise.all(
                  msg.canonicalMsg.map(
                    async (i) => await parseTxText(i)
                  )
                )

                return { tag, summary, success }
              })
            )
          : [
              {
                tag: 'Unknown',
                summary: ['Unknown tx'],
                success,
              },
            ]
      const messages = success
        ? successMessage
        : [{ tag: 'Failed', summary: [raw_log], success }]

      return makeTxUi(messages)
    })

    let subscribe = true
    const ret: TxUI[] = []
    promises
      .reduce(async (prev, next) => {
        subscribe && (await prev)
        subscribe && ret.push(await next)
      }, Promise.resolve())
      .then(() => {
        subscribe && setList((list) => [...list, ...ret])
      })
      .finally(() => {
        setParse(false)
      })

    return (): void => {
      subscribe = false
    }
  }, [txs])

  /* render */
  const ui =
    !response.loading && !isParse && !list.length
      ? {
          card: {
            title: t('Page:Txs:No transaction history'),
            content: t(
              "Page:Txs:Looks like you haven't made any transaction yet"
            ),
          },
        }
      : { more, list }

  return {
    ...response,
    loading: response.loading || isParse,
    ui,
  }
}
