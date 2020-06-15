import React, { useState } from 'react'
import { Seed, Address, Wallet, Bip } from '@terra-money/use-native-station'
import { useSignUp, SignUpNext } from '@terra-money/use-native-station'
import ErrorComponent from '../../components/ErrorComponent'
import Form from '../../components/Form'
import Warning from './Warning'
import Seeds from './Seeds'
import SelectAccount from './SelectAccount'
import ConfirmSeed from './ConfirmSeed'

const generateAddresses = async (
  phrase: string
): Promise<[Address, Address]> => {
  const addresses = ['', ''] as [Address, Address]
  return addresses
}

const generateWalletFromSeed = ([phrase, bip]: [string, Bip]): Wallet => {
  return { privateKey: '', publicKey: '', terraAddress: '' }
}

const encrypt = ([wallet, password]: [Wallet, string]): string => {
  return ''
}

export const storeKeys = (keys: Key[]) => {}

type Key = { name: string; address: string; wallet: string }
export const loadKeys = (): Key[] => []

type Params = { name: string; password: string; wallet: Wallet }
export const importKey = async ({ name, password, wallet }: Params) => {
  const keys = loadKeys()

  if (keys.find((key) => key.name === name))
    throw new Error('Key with that name already exists')

  const encrypted = encrypt([wallet, password])

  if (!encrypted) throw new Error('Encryption error occurred')

  const key: Key = {
    name,
    address: wallet.terraAddress,
    wallet: encrypted,
  }

  storeKeys([...keys, key])
}

const isExists = (q: keyof Key, v: string): boolean => {
  const keys = loadKeys()
  return !!keys.find((key) => key[q] === v)
}

const Add = ({ generated }: { generated?: Seed }) => {
  const { form, mnemonics: seeds, warning, next, reset, error } = useSignUp({
    generated,
    generateAddresses: async (phrase: string) =>
      await generateAddresses(phrase),
    generateWallet: async (phrase, bip) => {
      const params = [phrase, bip]
      const wallet = await generateWalletFromSeed(params as [string, Bip])
      return wallet
    },
    submit: importKey,
    isNameExists: (name: string) => isExists('name', name),
    isAddressExists: (address: string) => isExists('address', address),
  })

  /* warning */
  const [checked, setChecked] = useState(false)
  const toggle = () => setChecked((c) => !c)

  /* render */
  const renderNext = (next: SignUpNext) => {
    const components = {
      select: () => <SelectAccount {...next} />,
      confirm: () => <ConfirmSeed {...next} />,
    }

    return components[next.step]()
  }

  return error ? (
    <ErrorComponent>{error.message}</ErrorComponent>
  ) : next ? (
    renderNext(next)
  ) : (
    <Form form={form} disabled={generated && !checked}>
      {generated ? (
        <Warning {...warning} attrs={{ value: checked, onChange: toggle }} />
      ) : (
        <Seeds {...seeds} />
      )}
    </Form>
  )
}

export default Add
