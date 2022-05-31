import { StackActions, useNavigation } from '@react-navigation/native'
import {
  isTxError,
  RawKey,
  Tx,
  SyncTxBroadcastResult,
  Wallet,
} from '@terra-money/terra.js'
import { SignMode } from '@terra-money/terra.proto/cosmos/tx/signing/v1beta1/signing'
import { useRecoilValue } from 'recoil'
import { StackNavigationProp } from '@react-navigation/stack'

import TopupStore from 'stores/TopupStore'
import { useAuth, useConfig } from 'lib'
import { getDecyrptedKey } from 'utils/wallet'
import { getLCDClient } from '../screens/topup/TopupUtils'
import { useLoading } from './useLoading'
import { RootStackParams } from 'types'
import { useIsClassic } from 'lib'

type TopupCreateSignedResult =
  | {
      success: true
      signedTx: Tx
    }
  | {
      success: false
      title: string
      content: string
    }

type TopupResult =
  | { success: true }
  | {
      success: false
      title: string
      content: string
    }

const useSignedTx = (
  endpointAddress: string,
  navigation: StackNavigationProp<RootStackParams>
): {
  createSignedTx: (
    password: string
  ) => Promise<TopupCreateSignedResult>
  processTransaction: (signedTx: Tx) => Promise<TopupResult>
  confirm: (
    password: string,
    returnScheme: string
  ) => Promise<TopupResult>
} => {
  const { user } = useAuth()
  const { chain } = useConfig()
  const { dispatch } = useNavigation()
  const { showLoading, hideLoading } = useLoading({ navigation })
  const isClassic = useIsClassic()

  const unsignedTx = useRecoilValue(TopupStore.unsignedTx)

  const createSignedTx = async (
    password: string
  ): Promise<TopupCreateSignedResult> => {
    try {
      if (unsignedTx === undefined) {
        throw new Error('Tx is undefined')
      }

      const lcd = getLCDClient(
        chain.current.chainID,
        chain.current.lcd
      )
      const decyrptedKey = await getDecyrptedKey(
        user?.name || '',
        password
      )

      const key = new RawKey(Buffer.from(decyrptedKey, 'hex'))

      const wallet = new Wallet(lcd, key)
      const {
        account_number,
        sequence,
      } = await wallet.accountNumberAndSequence()

      const signedTx = await key.signTx(unsignedTx, {
        accountNumber: account_number,
        sequence,
        chainID: chain.current.chainID,
        signMode: SignMode.SIGN_MODE_DIRECT,
      }, isClassic)

      return { success: true, signedTx }
    } catch (e: any) {
      return {
        success: false,
        title: 'Unexpected Error',
        content: e.toString(),
      }
    }
  }

  const processTransaction = async (
    signedTx: Tx
  ): Promise<TopupResult> => {
    const broadcastSignedTx = async (
      signedTx: Tx
    ): Promise<SyncTxBroadcastResult> => {
      const lcd = getLCDClient(
        chain.current.chainID,
        chain.current.lcd
      )

      const txhash = await lcd.tx.hash(signedTx)
      showLoading({ txhash })
      const result = await lcd.tx.broadcast(signedTx)
      await hideLoading()
      return result
    }

    const putTxResult = async (
      url: string,
      txResult: any
    ): Promise<Response> => {
      for (const k in txResult) {
        if (txResult.hasOwnProperty(k) && txResult[k] !== undefined) {
          txResult[k] = String(txResult[k])
        }
      }

      const init = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(txResult),
      }

      return await fetch(url, init)
    }

    let ret: TopupResult
    try {
      if (signedTx === undefined) {
        throw new Error('No Signed Tx')
      }

      const broadcastResult = await broadcastSignedTx(signedTx)

      const putResult = await putTxResult(
        endpointAddress,
        broadcastResult
      )

      if (isTxError(broadcastResult)) {
        ret = {
          success: false,
          title: `Oops! Something went wrong`,
          content: broadcastResult.raw_log,
        }
      } else {
        ret =
          putResult.status === 200
            ? { success: true }
            : {
                success: false,
                title: `${putResult.status} error`,
                content: JSON.stringify(await putResult.json()),
              }
      }
    } catch (e: any) {
      ret = {
        success: false,
        title: 'Unexpected Error',
        content: e.toString(),
      }
    }
    return ret
  }

  const confirm = async (
    password: string,
    returnScheme: string
  ): Promise<TopupResult> => {
    const signedTxResult = await createSignedTx(password)
    if (!signedTxResult.success) {
      return {
        success: signedTxResult.success,
        title: signedTxResult.title,
        content: signedTxResult.content,
      }
    }

    const transactionResult = await processTransaction(
      signedTxResult.signedTx
    )
    if (transactionResult.success) {
      dispatch(
        StackActions.replace('SendTxCompleteView', { returnScheme })
      )
      return { success: true }
    } else {
      dispatch(
        StackActions.replace('SendTxCompleteView', {
          success: false,
          title: transactionResult.title,
          content: transactionResult.content,
          returnScheme,
        })
      )
      return {
        success: false,
        title: transactionResult.title,
        content: transactionResult.content,
      }
    }
  }

  return {
    createSignedTx,
    processTransaction,
    confirm,
  }
}

export default useSignedTx
