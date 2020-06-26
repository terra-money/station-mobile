import React from 'react'
import { useSignIn } from '@terra-money/use-native-station'
import { testPassword } from '../../utils/storage'
import { WithKeys } from '../../hooks'
import Form from '../../components/Form'
import useOnAuth from './useOnAuth'

interface Props {
  keys: Key[]
}

const Select = ({ keys }: Props) => {
  useOnAuth()

  const { form } = useSignIn({
    list: keys,
    test: (params) => testPassword(params, keys),
  })

  return <Form form={form} />
}

export default () => <WithKeys render={(params) => <Select {...params} />} />
