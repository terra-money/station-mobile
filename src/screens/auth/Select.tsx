import React, { useState } from 'react'
import { useAuth } from '@terra-money/use-native-station'
import { Alert, Button, Text, TextInput } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { testPassword } from '../../utils/wallet'
import { WithKeys } from '../../hooks'
import useOnAuth from './useOnAuth'

interface Props {
  wallets: LocalWallet[]
}

const Select = ({ wallets }: Props) => {
  useOnAuth()

  const { signIn } = useAuth()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('1234567890')

  const submit = async () => {
    try {
      if ((await testPassword({ name, password })) === false)
        throw new Error('Wrong Password!')
      const wallet = wallets.find((w) => w.name === name)
      wallet && signIn(wallet)
    } catch (e) {
      console.log(e)
      Alert.alert(e.toString())
    }
  }

  return (
    <>
      <Text>{`Select wallet: ${name}`}</Text>
      {wallets.map(({ name }, index) => (
        <Button
          key={index}
          title={name}
          onPress={() => setName(name)}
        />
      ))}
      <Text>{'Password: '}</Text>
      <TextInput
        style={styles.textInput}
        underlineColorAndroid="#ccc"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Log in" onPress={submit} />
    </>
  )
}

export default () => (
  <WithKeys render={(wallets) => <Select wallets={wallets} />} />
)

const styles = EStyleSheet.create({
  textInput: {
    marginLeft: 16,
    marginRight: 16,
  },
})
