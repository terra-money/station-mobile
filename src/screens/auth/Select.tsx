import React, { useState } from 'react'
import { useAuth, useSignIn } from '@terra-money/use-native-station'
import { testPassword } from '../../utils/wallet'
import { WithKeys } from '../../hooks'
import Form from '../../components/Form'
import useOnAuth from './useOnAuth'
import { Button, Text, TextInput } from 'react-native'

interface Props {
  wallets: LocalWallet[]
}

const Select = ({ wallets }: Props) => {
  useOnAuth()

  const {signIn}=useAuth()
  const [name, setName]= useState('')
  const [password, setPassword] = useState('1234567890')

  const submit=async () => {
    try {
      await testPassword({name, password})
      const wallet = wallets.find(w => w.name === name)
      wallet && signIn(wallet)
    } catch {
      console.log('Wrong Password!')
    }
  }

  return <>
    <Text>{'Select wallet:' + name}</Text>
    {wallets.map(({name}) => <Button title={name} onPress={()=> setName(name)} />)}
    <Text>{'Password:'}</Text>
    <TextInput value={password} secureTextEntry={true} onChangeText={setPassword} />
    <Button title="Log in" onPress={submit}/>
  </>  
}

export default () => <WithKeys render={(wallets) => <Select wallets={wallets} />} />
