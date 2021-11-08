import { CreateTxOptions, Msg, StdFee } from '@terra-money/terra.js'
import { UTIL } from 'consts'
import _ from 'lodash'

import { TxParam } from 'types/tx'

export const createTxOptionsToTxParam = (
  txOptions: CreateTxOptions
): TxParam => {
  return {
    msgs: txOptions.msgs.map((msg) => msg.toJSON()),
    fee: txOptions.fee?.toJSON(),
    memo: txOptions.memo,
    gasPrices: txOptions.gasPrices?.toString(),
    gasAdjustment: txOptions.gasAdjustment?.toString(),
    account_number: txOptions.account_number,
    sequence: txOptions.sequence,
    feeDenoms: txOptions.feeDenoms,
  }
}

export const txParamParser = (txParam: TxParam): CreateTxOptions => {
  const txMsgs = Array.isArray(txParam.msgs) ? txParam.msgs : []
  const msgs = _.reduce(
    txMsgs,
    (result: Msg[], msg: string): Msg[] => {
      const jsonData = UTIL.jsonTryParse<Msg.Data>(msg)
      jsonData && result.push(Msg.fromData(jsonData))
      return result
    },
    []
  )

  const txFee = txParam.fee && UTIL.jsonTryParse<any>(txParam.fee)
  const fee = txFee ? StdFee.fromData(txFee) : undefined
  return {
    ...txParam,
    msgs,
    fee,
  }
}
