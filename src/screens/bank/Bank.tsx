import React, { useState } from 'react'
import { useAssets, useAuth, useMenu, User } from '@terra-money/use-native-station'
import Page from '../../components/Page'
import WithAuth from '../../components/WithAuth'
import { StatusBar, View, Text, Button } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { NativeModules } from 'react-native'
import { decrypt, getStoredWallet } from '../../utils/storage'

const { Preferences, Keystore } = NativeModules

const fn = async (password: string) => {
  try {
    const names = await (Preferences.getString('names'))
    const [name] = JSON.parse(names)
    const key =  await Keystore.read(name)
    const parsed = JSON.parse(key)
    const decrypted = decrypt(key, password)
    console.log(decrypted);
  } catch(error) {
    console.log(error);
  }
}

const SendComponent = ({ denom }: { denom: string }) => {
  const {user} =useAuth()

  const [sendTo, setSendTo] = useState<string>()
  const [amount, setAmount] = useState<string>()
  const [memo, setMemo] = useState<string>()
  const [password, setPassword] = useState<string>("1234567890")

  return <>
    <Text>{denom}</Text>
    <Text>Send to:</Text>
    <TextInput onChangeText={setSendTo} />
    <Text>Amount:</Text>
    <TextInput onChangeText={setAmount} />
    <Text>Memo:</Text>
    <TextInput onChangeText={setMemo} />
    <Text>Password:</Text>
    <TextInput value={password} secureTextEntry={true} onChangeText={setPassword} />
    <Button title="Send" onPress={async () => {
      console.log(user?.name!, password)

      try {
        const storedWallet = await getStoredWallet(user?.name!, password)
        console.log(storedWallet);
      }catch(error){
        console.log('Password', error.message)
      }
    }}/>
    </>
}

const Assets = ({ user }: { user: User }) => {
  const { ui } = useAssets(user)

  console.log(ui?.available?.list, user.address);

  return <>{ui?.available?.list?.map(({ denom, display }) =>
    <View key={denom}>
      <Text>{denom}</Text>
      <Text>{display.value}</Text>
      <Text>{display.unit}</Text>
      <SendComponent denom={denom} />

    </View>)}</>
}

const Bank = () => {
  const { Bank: title } = useMenu()

  return (
    <Page title={title}>
      <StatusBar barStyle='dark-content' backgroundColor='transparent' />
      <WithAuth card>{user => <Assets user={user} />}</WithAuth>
    </Page>
  )
}

export default Bank
