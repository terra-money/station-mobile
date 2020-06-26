import React, { useState } from 'react'
import { Seed, Bip } from '@terra-money/use-native-station'
import { useSignUp, SignUpNext } from '@terra-money/use-native-station'
import { modules } from '../../utils'
import { WithKeys } from '../../hooks'
import { importKey } from '../../utils/storage'
import ErrorComponent from '../../components/ErrorComponent'
import Form from '../../components/Form'
import useOnAuth from './useOnAuth'
import Warning from './Warning'
import Seeds from './Seeds'
import SelectAccount from './SelectAccount'
import ConfirmSeed from './ConfirmSeed'

interface Props {
  generated?: Seed
}

interface Keys {
  names: string[]
  keys: Key[]
}

const Add = ({ generated, names, keys }: Props & Keys) => {
  useOnAuth()

  const { form, mnemonics: seeds, warning, next, reset, error } = useSignUp({
    generated,
    generateAddresses: modules.generateAddresses,
    generateWallet: async (phrase: string, bip: Bip) => {
      const params = [phrase, bip] as [string, Bip]
      const wallet = await modules.generateWalletFromSeed(params)
      return wallet
    },
    submit: importKey,
    isNameExists: (name: string) => !!names.includes(name),
    isAddressExists: (address: string) =>
      !!keys.find((key) => key.address === address),
  })

  /* warning */
  const [checked, setChecked] = useState(false)
  const toggle = () => setChecked((c) => !c)
  const checkbox = { value: checked, onValueChange: toggle }

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
        <Warning {...warning} attrs={checkbox} />
      ) : (
        <Seeds {...seeds} />
      )}
    </Form>
  )
}

export default (props: Props) => (
  <WithKeys render={(params) => <Add {...props} {...params} />} />
)
