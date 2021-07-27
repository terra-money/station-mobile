import { StackActions, useNavigation } from '@react-navigation/native'
import {
  isTxError,
  RawKey,
  StdTx,
  SyncTxBroadcastResult,
} from '@terra-money/terra.js'
import { useLoading } from 'hooks/useLoading'
import { useRecoilValue } from 'recoil'
import TopupStore from 'stores/TopupStore'
import { useAuth, useConfig } from 'use-station/src'
import { getDecyrptedKey } from 'utils/wallet'
import { getLCDClient } from '../screens/topup/TopupUtils'

type TopupCreateSignedResult =
  | {
      success: true
      signedTx: StdTx
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
  endpointAddress: string
): {
  createSignedTx: (
    password: string
  ) => Promise<TopupCreateSignedResult>
  processTransaction: (signedTx: StdTx) => Promise<TopupResult>
  confirm: (
    password: string,
    returnScheme: string
  ) => Promise<TopupResult>
} => {
  const { user } = useAuth()
  const { chain } = useConfig()
  const { showLoading, hideLoading } = useLoading()
  const { dispatch } = useNavigation()

  const stdSignMsg = useRecoilValue(TopupStore.stdSignMsg)

  const createSignedTx = async (
    password: string
  ): Promise<TopupCreateSignedResult> => {
    try {
      if (stdSignMsg === undefined) {
        throw new Error('No Sign Msg')
      }

      const decyrptedKey = await getDecyrptedKey(
        user?.name || '',
        password
      )

      const rk = new RawKey(Buffer.from(decyrptedKey, 'hex'))
      const signedTx = await rk.signTx(stdSignMsg)
      return { success: true, signedTx }
    } catch (e) {
      return {
        success: false,
        title: 'Unexpected Error',
        content: e.toString(),
      }
    }
  }

  const processTransaction = async (
    signedTx: StdTx
  ): Promise<TopupResult> => {
    const broadcastSignedTx = async (
      signedTx: StdTx
    ): Promise<SyncTxBroadcastResult> => {
      const result = await getLCDClient(
        chain.current.chainID,
        chain.current.lcd
      ).tx.broadcast(signedTx)
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
      showLoading()

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
    } catch (e) {
      ret = {
        success: false,
        title: 'Unexpected Error',
        content: e.toString(),
      }
    } finally {
      hideLoading()
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
