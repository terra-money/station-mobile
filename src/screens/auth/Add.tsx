import React, { useEffect, useState } from 'react'
import { Text,TextInput,Button }from 'react-native'
import { WithKeys } from '../../hooks'
import useWallet from '../../utils/wallet'
import useOnAuth from './useOnAuth'
import { MnemonicKey } from '@terra-money/terra.js'


interface Props {
  generated?: string[]
}

interface Keys {
  names?: string[]
  keys?: Key[]
}

const Add = ({ generated, names, keys }: Props & Keys) => {
  useOnAuth()

  const { recover } = useWallet()

  const [name, setName] = useState('test1')
  const [password, setPassword] = useState('1234567890')
  const [confirm, setConfirm] = useState('1234567890')
  const [seed, setSeed] = useState(generated?.join(' ') ?? 'victory inject boring prefer fruit improve elephant ghost spatial motion office biology reform garden senior accident razor noise thumb news adapt cup dance state')
  const [address, setAddress] = useState('')

  const { mk118, mk330, status } = useGenerateAddresses(seed)

  const submit = () => {
    const mk = address === mk118?.accAddress ? mk118 : mk330
    mk && recover(mk, {name, password})
  }

  useEffect(() => {
    mk330 && setAddress(mk330.accAddress)
  }, [mk330])
  
  return  <>
    <Text>Name:</Text>
    <TextInput value={name} onChangeText={text => setName(text)} />
    <Text>Password:</Text>
    <TextInput value={password} secureTextEntry={true} onChangeText={text => setPassword(text)} />
    <Text>Password confirm:</Text>
    <TextInput value={confirm} secureTextEntry={true} onChangeText={text => setConfirm(text)} />
    <Text>Seed phrase:</Text>
    <TextInput value={seed} onChangeText={text => setSeed(text)} />
    <Text>Address: {address}</Text>

    {/* {mk330 ? 
        <Button key={mk330.accAddress} 
          title={mk330.accAddress} 
          onPress={() => setAddress(mk330.accAddress)} 
        /> : <Text>{status}</Text>
    } */}
    
    <Button title="Submit" onPress={submit}/>
    </>
}

export default (props: Props) => (
  <WithKeys render={(params) => <Add {...props} {...params} />} />
)

const useGenerateAddresses = (mnemonic: string) => {
  const [mk118, setMnemonicKey118] = useState<MnemonicKey>()
  const [mk330, setMnemonicKey330] = useState<MnemonicKey>()
  const [status,setStatus] = useState<'idle' | 'loading' | 'hasValue'>('idle')

  useEffect(() => {
    const generateAddresses = () => {
      // const mk118 = new MnemonicKey({ mnemonic, coinType: 118 })
      const mk330 = new MnemonicKey({ mnemonic, coinType: 330 })
      setMnemonicKey118(mk118)
      setMnemonicKey330(mk330)
      setStatus('hasValue')
    }

    setStatus('loading')
    mnemonic && generateAddresses()
  }, [mnemonic])

  return { mk118, mk330, status }
}