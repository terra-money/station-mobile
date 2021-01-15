import React, { ReactElement, useState } from 'react'
import {
  useAssets,
  useAuth,
  useMenu,
  User,
} from '@terra-money/use-native-station'
import {
  StatusBar,
  View,
  Text,
  Button,
  TextInput,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { LCDClient, MsgSend, RawKey } from '@terra-money/terra.js'
import { BigNumber } from 'bignumber.js'
import { getDecyrptedKey } from '../../utils/wallet'
import WithAuth from '../../components/WithAuth'
import Page from '../../components/Page'
import dev from 'utils/dev'

const SendComponent = ({
  denom,
}: {
  denom: string
}): ReactElement => {
  const { user } = useAuth()

  const [sendTo, setSendTo] = useState<string>(
    'terra1jhgmns25suqnv5f9dzp4yx2naasyxpt07av5xd'
  )
  const [amount, setAmount] = useState<string>('1')
  const [memo, setMemo] = useState<string>('')
  const [password, setPassword] = useState<string>('1234567890')

  return (
    <>
      <Text>Send to:</Text>
      <TextInput
        style={styles.textInput}
        underlineColorAndroid="#ccc"
        value={sendTo}
        onChangeText={setSendTo}
      />
      <Text>Amount:</Text>
      <TextInput
        style={styles.textInput}
        underlineColorAndroid="#ccc"
        value={amount}
        onChangeText={setAmount}
      />
      <Text>Memo:</Text>
      <TextInput
        style={styles.textInput}
        underlineColorAndroid="#ccc"
        value={memo}
        onChangeText={setMemo}
      />
      <Text>Password:</Text>
      <TextInput
        style={styles.textInput}
        underlineColorAndroid="#ccc"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button
        title="Send"
        onPress={async (): Promise<void> => {
          try {
            const decyrptedKey = await getDecyrptedKey(
              user?.name || '',
              password
            )

            const msg = new MsgSend(
              user!.address,
              sendTo,
              new BigNumber(amount).times(1e6).toString() + denom
            )

            const lcdClient = new LCDClient({
              chainID: 'tequila-0004',
              URL: 'https://tequila-lcd.terra.dev',
            })

            const rk = new RawKey(Buffer.from(decyrptedKey, 'hex'))
            const wallet = lcdClient.wallet(rk)
            const signedTx = await wallet.createAndSignTx({
              msgs: [msg],
              memo,
            })
            const result = await lcdClient.tx.broadcastSync(signedTx)
            // broadcast = POST

            // Mempool = tx temporary (hash, immediately)
            // 1block = 6seconds
            // broadcastSync: !block, hash (Recommend) << Front-end
            // broadCatsBlock: block = 6s (Not recommended)

            dev.log(result.txhash)
          } catch (error) {
            dev.log('Password' + error.message)
          }
        }}
      />
    </>
  )
}

const Assets = ({ user }: { user: User }): ReactElement => {
  const { ui } = useAssets(user)

  return (
    <>
      {ui?.available?.list?.map(({ denom, display }) => (
        <View key={denom}>
          <Text>{denom}</Text>
          <Text>{display.value}</Text>
          <Text>{display.unit}</Text>
          <SendComponent denom={denom} />
        </View>
      ))}
    </>
  )
}

const Bank = (): ReactElement => {
  const { Bank: title } = useMenu()

  return (
    <Page title={title}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <WithAuth>
        {(user): ReactElement => <Assets user={user} />}
      </WithAuth>
    </Page>
  )
}

export default Bank

const styles = EStyleSheet.create({
  textInput: {
    marginLeft: 16,
    marginRight: 16,
  },
})
