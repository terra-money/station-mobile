import { Alert } from 'react-native'
import 'react-native-url-polyfill/auto' // to use URL
import {
  AccAddress,
  CreateTxOptions,
  Msg,
  Fee,
} from '@terra-money/terra.js'
import _ from 'lodash'

import { TxParam } from 'types/tx'

import currency from './currency'

export const jsonTryParse = <T>(value: string): T | undefined => {
  try {
    return JSON.parse(value) as T
  } catch {
    return undefined
  }
}

export const jsonTryStringify = (
  value: any,
  ...option: any
): string => {
  try {
    return JSON.stringify(value, ...option)
  } catch {
    return ''
  }
}

export const getParam = ({
  url,
  key,
}: {
  url: string
  key: string
}): string => {
  try {
    const instance = new URL(url)
    const params = new URLSearchParams(instance.search)
    return params.get(key) || ''
  } catch {
    return ''
  }
}

export const showSystemAlert = (
  message: string,
  done: string,
  onPress: () => void
): void => {
  Alert.alert('', message, [{ text: done, onPress }], {
    cancelable: false,
  })
}

export const isNativeTerra = (str: string): boolean =>
  str.startsWith('u') &&
  currency.currencies.includes(str.slice(1).toUpperCase())

export const isNativeDenom = (str: string): boolean =>
  str === 'uluna' || isNativeTerra(str)

export const isTerraAddress = (data: string): boolean =>
  AccAddress.validate(data)

export const tryNewURL = (str: string): URL | undefined => {
  try {
    return new URL(str)
  } catch {}
}

export const txParamParser = (txParam: TxParam): CreateTxOptions => {
  const txMsgs = Array.isArray(txParam.msgs) ? txParam.msgs : []
  const msgs = _.reduce(
    txMsgs,
    (result: Msg[], msg: string): Msg[] => {
      const jsonData = jsonTryParse<Msg.Data>(msg)
      jsonData && result.push(Msg.fromData(jsonData))
      return result
    },
    []
  )

  const txFee = txParam.fee && jsonTryParse<any>(txParam.fee)
  const fee = txFee ? Fee.fromData(txFee) : undefined
  return {
    ...txParam,
    msgs,
    fee,
  }
}

export const createTxOptionsToTxParam = (
  txOptions: CreateTxOptions
): TxParam => {
  return {
    msgs: txOptions.msgs.map((msg) => msg.toJSON()),
    fee: txOptions.fee?.toJSON(),
    memo: txOptions.memo,
    gasPrices: txOptions.gasPrices?.toString(),
    gasAdjustment: txOptions.gasAdjustment?.toString(),
    account_number: txOptions.accountNumber,
    sequence: txOptions.sequence,
    feeDenoms: txOptions.feeDenoms,
  }
}

export const toBase64 = (value: string): string =>
  Buffer.from(value).toString('base64')

export const fromBase64 = (value: string): string =>
  Buffer.from(value, 'base64').toString()
