import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import WalletConnect from '@walletconnect/client'

import { CreateTxOptions } from '@terra-money/terra.js'

import { User } from 'lib'

import Body from 'components/layout/Body'
import WithAuth from 'components/layout/WithAuth'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import { Button, FormLabel, FormInput } from 'components'

import { RootStackParams } from 'types/navigation'

import { testPassword } from 'utils/wallet'
import WalletConnectStore from 'stores/WalletConnectStore'
import useWalletConnectConfirm from 'hooks/useWalletConnectConfirm'
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native'
import { txParamParser } from 'utils/walletconnect'
import DeviceSelector from '../../screens/auth/ConnectLedger/DeviceSelector'
import { useLoading } from '../../hooks/useLoading'

type Props = StackScreenProps<
  RootStackParams,
  'WalletConnectConfirmPassword'
>

const Render = ({
  user,
  connector,
  id,
  txOptions,
  navigation,
}: {
  user: User
  connector: WalletConnect
  id: number
  txOptions: CreateTxOptions
} & Props): ReactElement => {
  const walletName = user.name
  const setIsListenConfirmRemove = useSetRecoilState(
    WalletConnectStore.isListenConfirmRemove
  )
  const [inputPassword, setInputPassword] = useState('')
  let deviceId = ''

  const [errorMessage, setErrorMessage] = useState('')
  const { showLoading, hideLoading } = useLoading({ navigation })

  const { dispatch } =
    useNavigation<NavigationProp<RootStackParams>>()
  const { confirmSign, confirmResult } = useWalletConnectConfirm({
    connector,
    id,
    navigation,
    user,
  })

  const onPressAllow = async (): Promise<void> => {
    setErrorMessage('')
    setIsListenConfirmRemove(false)
    showLoading({ title: user.ledger ? 'Confirm in your Ledger' : undefined, txhash: '' })
    const result = await testPassword({
      name: user.name,
      password: inputPassword,
    })
    if (result.isSuccess) {
      confirmSign({
        address: user.address,
        walletName,
        txOptions,
        password: user.ledger ? deviceId : inputPassword,
      })
    } else {
      setErrorMessage('Incorrect password')
      setIsListenConfirmRemove(true)
    }
  }

  useEffect(() => {
    if (confirmResult) {
      hideLoading()
      dispatch(StackActions.popToTop())
      dispatch(
        StackActions.replace('Complete', { result: confirmResult })
      )
    }
  }, [confirmResult])

  return (
    <>
      <SubHeader theme={'sapphire'} title={user.ledger ? 'Ledger' : 'Password'} />
      <Body
        theme={'sky'}
        containerStyle={{
          justifyContent: 'space-between',
          marginBottom: 40,
          paddingTop: 20,
        }}
      >
        {user.ledger ? (
          <DeviceSelector onSubmit={(id) => { deviceId = id; onPressAllow() }}/>
        ) : (
          <>
            <View>
              <FormLabel text="Confirm with password" />
              <FormInput
                errorMessage={errorMessage}
                value={inputPassword}
                onChangeText={setInputPassword}
                secureTextEntry
              />
            </View>

            <View>
              <Button
                theme={'sapphire'}
                title={'Confirm'}
                onPress={onPressAllow}
              />
            </View>
          </>
        )}
      </Body>
    </>
  )
}

const ConfirmPassword = (props: Props): ReactElement => {
  const _handshakeTopic = props.route.params?.handshakeTopic
  const walletConnectors = useRecoilValue(
    WalletConnectStore.walletConnectors
  )
  const id = props.route.params?.id
  const tx = props.route.params?.tx
  const connector = walletConnectors[_handshakeTopic]

  return (
    <WithAuth>
      {(user): ReactElement => (
        <Render
          {...{
            ...props,
            user,
            id,
            txOptions: txParamParser(tx),
            connector,
          }}
        />
      )}
    </WithAuth>
  )
}

ConfirmPassword.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default ConfirmPassword
