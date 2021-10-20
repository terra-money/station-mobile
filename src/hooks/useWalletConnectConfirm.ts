import _ from 'lodash'
import { CreateTxOptions, isTxError } from '@terra-money/terra.js'
import WalletConnect from '@walletconnect/client'
import { useEffect, useState } from 'react'

import useTx from './useTx'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParams } from 'types'
import { User } from 'lib'

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

export type UseWalletConnectConfirmReturn = {
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
    txOptions: CreateTxOptions
  }) => Promise<void>
  confirmResult?: ConfirmResultType
}

const useWalletConnectConfirm = ({
  id,
  connector,
  user,
  navigation,
}: {
  id: number
  connector: WalletConnect
  user: User
  navigation: StackNavigationProp<RootStackParams>
}): UseWalletConnectConfirmReturn => {
  const [
    confirmResult,
    setConfirmResult,
  ] = useState<ConfirmResultType>()

  const { broadcastSync, broadcastResult } = useTx({
    user,
    navigation,
  })

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
    txOptions,
  }: {
    password: string
    address: string
    walletName: string
    txOptions: CreateTxOptions
  }): Promise<void> => {
    broadcastSync({
      address,
      walletName,
      password,
      txOptions,
    }).catch((error) => {
      rejectWalletConnectRequest({
        errorCode: ErrorCodeEnum.createTxFailed,
        message: _.toString(error),
      })
      setConfirmResult({
        title: 'Error',
        content: _.toString(error),
        button: 'Continue',
      })
    })
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
