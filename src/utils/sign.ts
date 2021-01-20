import CryptoJS from 'crypto-js'
import { ecdsaSign } from 'secp256k1'
import _ from 'lodash'
import { RawKey } from '@terra-money/terra.js'
import { Base } from 'use-station/src'

export const createSignedTransaction = async (
  tx: Record<string, any>,
  privateKey: string,
  request: Base
): Promise<string> => {
  const key = new RawKey(Buffer.from(privateKey, 'hex'))
  const { sequence, account_number, chain_id } = request
  const _req = {
    sequence,
    accountNumber: account_number,
    chainId: chain_id,
  }
  const signMessage = createSignMessage(tx, _req)

  const signature = signWithPrivateKey(
    signMessage,
    Buffer.from(privateKey, 'hex')
  )

  const signatureObject = createSignature(
    signature,
    sequence,
    account_number,
    key.publicKey
  )

  return JSON.stringify(
    Object.assign({}, tx, { signatures: [signatureObject] })
  )
}

const signWithPrivateKey = (
  signMessage: string,
  privateKey: Uint8Array
): Buffer => {
  const signMessageString =
    typeof signMessage === 'string'
      ? signMessage
      : JSON.stringify(signMessage)
  const signHash = Buffer.from(
    CryptoJS.SHA256(signMessageString).toString(),
    `hex`
  )
  const { signature } = ecdsaSign(signHash, privateKey)

  return Buffer.from(signature)
}

const createSignature = (
  signature: Buffer,
  sequence: string,
  accountNumber: string,
  publicKey?: Buffer
): {
  signature: any
  account_number: any
  sequence: any
  pub_key: {
    type: string
    value: any
  }
} => ({
  signature: signature.toString('base64'),
  account_number: accountNumber,
  sequence,
  pub_key: {
    type: 'tendermint/PubKeySecp256k1',
    value: publicKey?.toString('base64'),
  },
})

const createSignMessage = (
  jsonTx: Record<string, any>,
  {
    sequence,
    accountNumber,
    chainId,
  }: {
    sequence: string
    accountNumber: string
    chainId: string
  }
): string => {
  const fee = {
    amount: jsonTx.fee.amount || [],
    gas: jsonTx.fee.gas,
  }

  return JSON.stringify(
    removeEmptyProperties({
      fee,
      memo: jsonTx.memo,
      msgs: jsonTx.msg,
      sequence,
      account_number: accountNumber,
      chain_id: chainId,
    })
  )
}

const removeEmptyProperties = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  return _.pickBy(obj, _.identity)
}
