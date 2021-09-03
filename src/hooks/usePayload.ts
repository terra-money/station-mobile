import _ from 'lodash'
import BigNumber from 'bignumber.js'

import { fromBase64, isNativeDenom, jsonTryParse } from 'utils/util'
import { useConfig } from 'lib'
import { RootStackParams } from 'types'
import { TxParam } from 'types/tx'

type SendPayloadType = {
  address?: string // terra, ethereum, bsc
  amount?: string
  token: string // native token : denom, cw20 : contract address
  memo?: string
}

type WalletConnectPayloadType = {
  uri: string
}

type WalletConnectConfirmPayloadType = {
  handshakeTopic: string
  id: number
  params: TxParam
}

type PayloadType =
  | SendPayloadType
  | WalletConnectPayloadType
  | WalletConnectConfirmPayloadType

type ValidationResultType<P> =
  | {
      success: true
      params: P
    }
  | {
      success: false
      errorMessage: string
    }

const DEFAULT_ERROR_MESSAGE = 'payload is invalid or empty'

const usePayload = (): {
  parsePayload: <T extends PayloadType>(
    value: string
  ) => T | undefined
  validSendPayload: (
    payload: string
  ) => Promise<ValidationResultType<RootStackParams['Send']>>
  validWalletConnectPayload: (
    payload: string
  ) => Promise<ValidationResultType<RootStackParams['WalletConnect']>>
  validWalletConnectConfirmPayload: (
    payload: string
  ) => Promise<
    ValidationResultType<RootStackParams['WalletConnectConfirm']>
  >
} => {
  const { chain } = useConfig()

  const parsePayload = <T extends PayloadType>(
    value: string
  ): T | undefined => jsonTryParse<T>(fromBase64(value))
  /**
   * @returns errorMessage
   */
  const validSendPayload = async (
    payload: string
  ): Promise<ValidationResultType<RootStackParams['Send']>> => {
    const params = parsePayload<SendPayloadType>(payload)

    const bn = new BigNumber(params?.amount || '0')
      .div(1e6)
      .dp(6, BigNumber.ROUND_DOWN)

    let amount
    if (bn.isNaN()) {
      amount = ''
    } else if (bn.isGreaterThan(1e15)) {
      amount = bn.modulo(1e15).toString(10)
    } else {
      amount = bn.toString(10)
    }

    let isCorrectDenom = false
    let errorMessage = ''

    try {
      const fetchList = await (
        await fetch('https://assets.terra.money/cw20/tokens.json')
      ).json()
      const whitelist = fetchList[chain.current.name]
      const token = params?.token || ''
      isCorrectDenom = isNativeDenom(token) || whitelist[token]
    } catch {
      return {
        success: false,
        errorMessage:
          'Please check your internet connection and retry again',
      }
    }

    if (params) {
      const required = ['token']

      _.forEach(required, (key) => {
        if (false === _.has(params, key)) {
          errorMessage = `"${key}" parameter required`
        }
      })

      if (!isCorrectDenom) {
        errorMessage = `incorrect token "${params?.token}"`
      }

      if (errorMessage) {
        return { success: false, errorMessage }
      }

      const pageParams = {
        ...params,
        amount,
        denomOrToken: params.token,
        toAddress: params.address,
      }

      return { success: true, params: pageParams }
    }

    return {
      success: false,
      errorMessage: DEFAULT_ERROR_MESSAGE,
    }
  }

  const validWalletConnectPayload = async (
    payload: string
  ): Promise<
    ValidationResultType<RootStackParams['WalletConnect']>
  > => {
    const params = parsePayload<WalletConnectPayloadType>(payload)

    let errorMessage = ''

    if (params) {
      const required = ['uri']

      _.forEach(required, (key) => {
        if (false === _.has(params, key)) {
          errorMessage = `"${key}" parameter required`
        }
      })

      if (errorMessage) {
        return { success: false, errorMessage }
      }

      return { success: true, params }
    }

    return {
      success: false,
      errorMessage: DEFAULT_ERROR_MESSAGE,
    }
  }

  const validWalletConnectConfirmPayload = async (
    payload: string
  ): Promise<
    ValidationResultType<RootStackParams['WalletConnectConfirm']>
  > => {
    const params = parsePayload<WalletConnectConfirmPayloadType>(
      payload
    )

    let errorMessage = ''

    if (params) {
      const required = ['handshakeTopic', 'id', 'params']

      _.forEach(required, (key) => {
        if (false === _.has(params, key)) {
          errorMessage = `"${key}" parameter required`
        }
      })

      if (errorMessage) {
        return { success: false, errorMessage }
      }

      return { success: true, params }
    }

    return {
      success: false,
      errorMessage: DEFAULT_ERROR_MESSAGE,
    }
  }

  return {
    parsePayload,
    validSendPayload,
    validWalletConnectPayload,
    validWalletConnectConfirmPayload,
  }
}

export default usePayload
