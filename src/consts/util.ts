import 'react-native-url-polyfill/auto' // to use URL
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import { Alert } from 'react-native'

import { Token, uToken } from 'types'

import currency from './currency'

const TERRA_DECIMAL = 1e6

const truncate = (text = '', [h, t]: number[] = [8, 6]): string => {
  const head = text.slice(0, h)
  const tail = text.slice(-1 * t, text.length)
  return text.length > h + t ? [head, tail].join('...') : text
}

const jsonTryParse = <T>(value: string): T | undefined => {
  try {
    return JSON.parse(value) as T
  } catch {
    return undefined
  }
}

const jsonTryStringify = (value: any, ...option: any): string => {
  try {
    return JSON.stringify(value, ...option)
  } catch {
    return ''
  }
}

const setComma = (str?: string | number): string => {
  const parts = _.toString(str).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

const delComma = (str: string | number): string => {
  return _.toString(str).replace(/,/g, '')
}

const extractNumber = (str: string): string => str.replace(/\D+/g, '')

const isNativeTerra = (str: string): boolean =>
  str.startsWith('u') &&
  str.length === 4 &&
  currency.currencies.includes(str.slice(1).toUpperCase())

const isNativeDenom = (str: string): boolean =>
  str === 'uluna' || isNativeTerra(str)

const isIbcDenom = (string = ''): boolean => string.startsWith('ibc/')

const isNumberString = (value: number | string): boolean =>
  false === new BigNumber(value || '').isNaN()

const toBn = (value?: number | string): BigNumber =>
  new BigNumber(value || 0)

const isEven = (value: number): boolean => value % 2 === 0

const isOdd = (value: number): boolean => !isEven(value)

const microfy = (value: Token): uToken =>
  toBn(value).multipliedBy(TERRA_DECIMAL).toString(10) as uToken

const demicrofy = (value: uToken): Token =>
  toBn(value).div(TERRA_DECIMAL).toString(10) as Token

const formatAmount = (
  value: uToken,
  option?: {
    abbreviate?: boolean
    toFix?: number
  }
): string => {
  const demicrofyValue = toBn(demicrofy(value))
  let strValue = '0'
  if (option?.toFix !== undefined) {
    strValue = demicrofyValue.toFixed(option?.toFix)
  } else {
    strValue = demicrofyValue.toString(10)
  }

  if (option?.abbreviate) {
    const abbreviated = abbreviateNumber(strValue)
    return `${setComma(abbreviated.value)}${abbreviated.unit}`
  }
  return setComma(strValue)
}

const abbreviateNumber = (
  value: string
): { value: string; unit: string } => {
  const bn = toBn(value)
  if (bn.isGreaterThan(1e12)) {
    return { value: bn.div(1e12).toFixed(2), unit: 'T' }
  } else if (bn.isGreaterThan(1e9)) {
    return { value: bn.div(1e9).toFixed(2), unit: 'B' }
  } else if (bn.isGreaterThan(1e6)) {
    return { value: bn.div(1e6).toFixed(2), unit: 'M' }
  }
  return { value, unit: '' }
}

const getPercentageChange = ({
  from,
  to,
}: {
  from: BigNumber
  to: BigNumber
}): {
  isIncreased: boolean
  percentage: BigNumber
} => {
  const isIncreased = to.isGreaterThanOrEqualTo(from)
  const percentage = isIncreased
    ? to.div(from).minus(1)
    : new BigNumber(1).minus(to.div(from))
  return {
    isIncreased,
    percentage,
  }
}

const toBase64 = (value: string): string =>
  Buffer.from(value).toString('base64')

const fromBase64 = (value: string): string =>
  Buffer.from(value, 'base64').toString()

const formatPercentage = (per: BigNumber): string => {
  return per.lt(0.01)
    ? '<0.01'
    : per.gt(99.9)
    ? '>99.9'
    : per.multipliedBy(100).toFixed(2)
}

const getParam = ({
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
const showSystemAlert = (
  message: string,
  done: string,
  onPress: () => void
): void => {
  Alert.alert('', message, [{ text: done, onPress }], {
    cancelable: false,
  })
}
const tryNewURL = (str: string): URL | undefined => {
  try {
    return new URL(str)
  } catch {}
}

export default {
  truncate,
  jsonTryParse,
  jsonTryStringify,
  setComma,
  delComma,
  extractNumber,
  isNativeTerra,
  isNativeDenom,
  isIbcDenom,
  isNumberString,
  toBn,
  isEven,
  isOdd,
  microfy,
  demicrofy,
  formatAmount,
  abbreviateNumber,
  getPercentageChange,
  toBase64,
  fromBase64,
  formatPercentage,
  getParam,
  showSystemAlert,
  tryNewURL,
}
