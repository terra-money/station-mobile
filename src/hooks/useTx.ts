import { useState, useEffect } from 'react'
import {
  CreateTxOptions,
  LCDClient,
  RawKey,
  Key,
  TxInfo,
} from '@terra-money/terra.js'

import { useConfig } from 'lib'
import { usePollTxHash } from 'lib/post/useConfirm'

import { getDecyrptedKey } from 'utils/wallet'
import { useLoading } from './useLoading'

const useTx = (): {
  broadcastResult?: TxInfo
  broadcastSync: (props: {
    address: string
    walletName: string
    password: string
    tx: CreateTxOptions
  }) => Promise<void>
} => {
  const { chain } = useConfig()
  const { showLoading, hideLoading } = useLoading()
  const [txhash, setTxHash] = useState<string>('')
  const [broadcastResult, setBroadcastResult] = useState<TxInfo>()
  const tsInfo = usePollTxHash(txhash)

  const getKey = async (params: {
    name: string
    password: string
  }): Promise<Key> => {
    const { name, password } = params
    const decyrptedKey = await getDecyrptedKey(name, password)
    return new RawKey(Buffer.from(decyrptedKey, 'hex'))
  }

  const broadcastSync = async ({
    address,
    walletName,
    password,
    tx,
  }: {
    address: string
    walletName: string
    password: string
    tx: CreateTxOptions
  }): Promise<void> => {
    const lcd = new LCDClient({
      chainID: chain.current.chainID,
      URL: chain.current.lcd,
      gasPrices: tx.gasPrices,
    })

    // fee + tax
    const unsignedTx = await lcd.tx.create(address, tx)
    const key = await getKey({
      name: walletName,
      password,
    })
    const signed = await key.signTx(unsignedTx)

    const result = await lcd.tx.broadcastSync(signed)
    showLoading({ txhash: result.txhash })
    setTxHash(result.txhash)
  }

  useEffect(() => {
    if (tsInfo) {
      setBroadcastResult(tsInfo)
      hideLoading()
    }
    return (): void => {
      setBroadcastResult(undefined)
    }
  }, [tsInfo])

  return {
    broadcastResult,
    broadcastSync,
  }
}

export default useTx