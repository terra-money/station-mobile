import React, { useState } from 'react'
import { Text, TextInput, Button } from 'react-native'
import { WithKeys } from '../../hooks'
import { recover } from '../../utils/wallet'
import useOnAuth from './useOnAuth'
import { MnemonicKey } from '@terra-money/terra.js'
import { Alert } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

interface Props {
  generated?: string[]
}

interface Keys {
  names?: string[]
  keys?: Key[]
}

const Add = ({ generated, names, keys }: Props & Keys) => {
  useOnAuth()

  const [name, setName] = useState('test1')
  const [password, setPassword] = useState('1234567890')
  const [confirm, setConfirm] = useState('1234567890')
  const [seed, setSeed] = useState(generated?.join(' '))
  const [address, setAddress] = useState('')

  const [mk118, setMk118] = useState<MnemonicKey>()
  const [mk330, setMk330] = useState<MnemonicKey>()

  const generateAddresses = () => {
    if (seed) {
      const { mk118, mk330 } = useGenerateAddresses(seed)
      setMk118(mk118)
      setMk330(mk330)
    }
  }

  const submit = () => {
    try {
      const mk = address === mk118?.accAddress ? mk118 : mk330
      mk && recover(mk, { name, password })

      Alert.alert('Success')
    } catch (e) {
      Alert.alert('Failure', e.toString())
    }
  }

  // useEffect(() => {
  //   mk118 && mk330 && setAddress(mk330.accAddress)
  // }, [mk330])

  return (
    <>
      <Text>Name: </Text>
      <TextInput
        style={styles.textInput}
        underlineColorAndroid='#ccc'
        value={name}
        onChangeText={(text) => {
          setName(text)
        }}
      />
      <Text>Password: </Text>
      <TextInput
        style={styles.textInput}
        underlineColorAndroid='#ccc'
        value={password}
        secureTextEntry={true}
        onChangeText={(text) => {
          setPassword(text)
        }}
      />
      <Text>Password confirm: </Text>
      <TextInput
        style={styles.textInput}
        underlineColorAndroid='#ccc'
        value={confirm}
        secureTextEntry={true}
        onChangeText={(text) => {
          setConfirm(text)
        }}
      />
      <Text>Seed phrase:</Text>
      <TextInput
        style={styles.textInput}
        multiline={true}
        underlineColorAndroid='#ccc'
        value={seed}
        onChangeText={(text) => {
          setSeed(text)
        }}
      />
      <Text>Address: {address}</Text>

      <Button title='Generate' onPress={() => seed && generateAddresses()} />
      {mk118 &&
        mk330 &&
        [mk118, mk330].map((mk) => (
          <Button
            key={mk.accAddress}
            title={mk.accAddress}
            onPress={() => setAddress(mk.accAddress)}
          />
        ))}

      <Button title='Submit' onPress={submit} />
    </>
  )
}

export default (props: Props) => (
  <WithKeys render={(wallets) => <Add {...props} />} />
)

const useGenerateAddresses = (mnemonic: string) => {
  const mk118 = new MnemonicKey({ mnemonic, coinType: 118 })
  const mk330 = new MnemonicKey({ mnemonic, coinType: 330 })

  return { mk118, mk330 }
}

const styles = EStyleSheet.create({
  textInput: {
    marginLeft: 16,
    marginRight: 16,
  },
})
