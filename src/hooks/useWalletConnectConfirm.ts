import _ from 'lodash'
import { CreateTxOptions, isTxError } from '@terra-money/terra.js'
import WalletConnect from '@walletconnect/client'
import { useEffect, useState } from 'react'

import useTx from './useTx'

export enum ErrorCodeEnum {
  userDenied = 1, // User Denied
  createTxFailed = 2, // CreateTxFailed (no Txhash)
  txFailed = 3, // TxFailed (Broadcast with Txhash with fail)
  timeOut = 4, // Timeout
  etc = 99,
}

export type ConfirmResultType = {
  title: string
  content: string
  button: string
}

const useWalletConnectConfirm = ({
  id,
  connector,
}: {
  id: number
  connector: WalletConnect
}): {
  rejectWalletConnectRequest: (props: {
    errorCode?: ErrorCodeEnum
    message: string
    txHash?: string
    raw_message?: any
  }) => void
  confirmSign: (props: {
    password: string
    address: string
    walletName: string
    tx: CreateTxOptions
  }) => Promise<void>
  confirmResult?: ConfirmResultType
} => {
  const [
    confirmResult,
    setConfirmResult,
  ] = useState<ConfirmResultType>()

  const { broadcastSync, broadcastResult } = useTx()

  const rejectWalletConnectRequest = ({
    errorCode = ErrorCodeEnum.etc,
    message,
    txHash,
    raw_message,
  }: {
    errorCode?: ErrorCodeEnum
    message: string
    txHash?: string
    raw_message?: any
  }): void => {
    connector.rejectRequest({
      id,
      error: {
        message: JSON.stringify({
          code: errorCode,
          message,
          txHash,
          raw_message,
        }),
      },
    })
  }

  const confirmSign = async ({
    password,
    address,
    walletName,
    tx,
  }: {
    password: string
    address: string
    walletName: string
    tx: CreateTxOptions
  }): Promise<void> => {
    try {
      broadcastSync({
        address,
        walletName,
        password,
        tx,
      })
    } catch (error) {
      rejectWalletConnectRequest({
        errorCode: ErrorCodeEnum.createTxFailed,
        message: _.toString(error),
      })
      setConfirmResult({
        title: 'Error',
        content: _.toString(error),
        button: 'Continue',
      })
    }
  }

  useEffect(() => {
    if (broadcastResult) {
      let title = ''
      let content = ''
      if (isTxError(broadcastResult)) {
        title = 'Error!'
        content = `Oops! Something went wrong\n${broadcastResult.raw_log}`
        rejectWalletConnectRequest({
          errorCode: ErrorCodeEnum.txFailed,
          message: broadcastResult.raw_log,
          txHash: broadcastResult.txhash,
          raw_message: broadcastResult,
        })
      } else {
        title = 'Success!'
        content =
          'Your transaction has been successfully processed. Return to your browser and continue.'
        connector.approveRequest({
          id,
          result: broadcastResult,
        })
      }
      setConfirmResult({
        title,
        content,
        button: 'Continue',
      })
    }
  }, [broadcastResult])

  return {
    rejectWalletConnectRequest,
    confirmSign,
    confirmResult,
  }
}

export default useWalletConnectConfirm
