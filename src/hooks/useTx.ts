import { useState, useEffect } from 'react'
import {
  CreateTxOptions,
  RawKey,
  Key,
  TxInfo,
} from '@terra-money/terra.js'
import { StackNavigationProp } from '@react-navigation/stack'

import { User } from 'lib'
import { usePollTxHash } from 'lib/post/useConfirm'

import { getDecyrptedKey } from 'utils/wallet'
import { useLoading } from './useLoading'
import { RootStackParams } from 'types'
import useLCD from './useLCD'

const useTx = ({
  user,
  navigation,
}: {
  user: User
  navigation: StackNavigationProp<RootStackParams>
}): {
  broadcastResult?: TxInfo
  broadcastSync: (props: {
    address: string
    walletName: string
    password: string
    tx: CreateTxOptions
  }) => Promise<void>
} => {
  const lcd = useLCD()
  const { showLoading, hideLoading } = useLoading({ navigation })
  const [txhash, setTxHash] = useState<string>('')
  const [broadcastResult, setBroadcastResult] = useState<TxInfo>()
  const tsInfo = usePollTxHash(txhash)

  const getKey = async ({
    password,
  }: {
    password: string
  }): Promise<Key> => {
    const decyrptedKey = await getDecyrptedKey(user.name, password)
    return new RawKey(Buffer.from(decyrptedKey, 'hex'))
  }

  const broadcastSync = async ({
    password,
    tx,
  }: {
    password: string
    tx: CreateTxOptions
  }): Promise<void> => {
    // fee + tax
    const unsignedTx = await lcd.tx.create(user.address, tx)
    const key = await getKey({ password })
    const signed = await key.signTx(unsignedTx)

    const result = await lcd.tx.broadcastSync(signed)
    if ('code' in result && Number(result.code) !== 0) {
      throw new Error(result.raw_log)
    }
    showLoading({ txhash: result.txhash })
    setTxHash(result.txhash)
  }

  useEffect(() => {
    if (tsInfo) {
      hideLoading().then(() => {
        setBroadcastResult(tsInfo)
      })
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
