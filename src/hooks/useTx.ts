import { useState, useEffect } from 'react'
import {
  CreateTxOptions,
  RawKey,
  Key,
  TxInfo,
  Wallet,
} from '@terra-money/terra.js'
import { SignMode } from '@terra-money/terra.proto/cosmos/tx/signing/v1beta1/signing'
import { StackNavigationProp } from '@react-navigation/stack'

import { useConfig, User } from 'lib'
import { usePollTxHash } from 'lib/post/useConfirm'

import { getDecyrptedKey } from 'utils/wallet'
import { useLoading } from './useLoading'
import { RootStackParams } from 'types'
import useLCD from './useLCD'

import { LedgerKey } from '@terra-money/ledger-terra-js'
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'

const useTx = ({
  user,
  navigation,
}: {
  user: User
  navigation: StackNavigationProp<RootStackParams>
}): {
  broadcastResult?: TxInfo
  broadcastSync: (props: {
    password: string // is the device id for ledger
    txOptions: CreateTxOptions
  }) => Promise<void>
} => {
  const { chain } = useConfig()
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
    txOptions,
  }: {
    password: string
    txOptions: CreateTxOptions
  }): Promise<void> => {
    const chainID = chain.current.chainID
    const key = user.ledger 
      ? await LedgerKey.create(await TransportBLE.open(password), user.path)
      : await getKey({ password }) 

    const wallet = new Wallet(lcd, key)
    const {
      account_number,
      sequence,
    } = await wallet.accountNumberAndSequence()

    const fee =
      txOptions.fee ||
      (await lcd.tx.estimateFee(
        [
          {
            sequenceNumber: await wallet.sequence(),
            publicKey: wallet.key.publicKey,
          },
        ],
        { ...txOptions, feeDenoms: ['uusd'] }
      ))

    const newTxOptions: CreateTxOptions = { ...txOptions, fee }

    // fee
    const unsignedTx = await lcd.tx.create(
      [{ address: user.address }],
      newTxOptions
    )

    const signed = await key.signTx(unsignedTx, {
      accountNumber: account_number,
      sequence,
      chainID,
      signMode: user.ledger 
        ? SignMode.SIGN_MODE_LEGACY_AMINO_JSON
        : SignMode.SIGN_MODE_DIRECT,
    })
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
