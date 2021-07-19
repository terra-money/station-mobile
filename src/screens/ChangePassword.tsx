import React, { ReactElement, useEffect, useState } from 'react'
import _ from 'lodash'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'

import { useChangePassword, useManageAccounts } from 'use-station/src'

import {
  getEncryptedKey,
  decryptKey,
  changePassword,
} from 'utils/wallet'
import { Button, UseStationForm } from 'components'
import { RootStackParams } from 'types'
import { useAlert } from 'hooks/useAlert'

type Props = StackScreenProps<RootStackParams, 'ChangePassword'>

const ChangePassword = ({ route }: Props): ReactElement => {
  const walletName = route.params?.walletName
  const { goBack } = useNavigation()
  const { alert } = useAlert()
  const [walletKey, setWalletKey] = useState('')
  const { password: passwordText } = useManageAccounts()

  const _changePassword = async ({
    current,
    password,
  }: {
    current: string
    password: string
  }): Promise<void> => {
    if (await changePassword(walletName, current, password)) {
      alert({ desc: passwordText.title })
      goBack()
    } else {
      alert({ desc: 'Error while changing password' })
    }
  }

  const testPassword = (name: string, password: string): boolean => {
    const decryptedKey = decryptKey(walletKey, password)
    return _.some(decryptedKey)
  }

  const form = useChangePassword({
    name: walletName,
    test: ({ name, password }) => testPassword(name, password),
    changePassword: _changePassword,
  })

  const initPage = async (): Promise<void> => {
    setWalletKey(await getEncryptedKey(walletName))
  }

  useEffect(() => {
    initPage()
  }, [])

  return (
    <>
      <SubHeader theme={'sapphire'} title={'Change password'} />
      <Body theme={'sky'} scrollable>
        <UseStationForm form={form} />
        <Button
          theme={'sapphire'}
          disabled={form.disabled}
          title={form.submitLabel}
          onPress={form.onSubmit}
          containerStyle={{ marginTop: 20 }}
        />
      </Body>
    </>
  )
}

ChangePassword.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default ChangePassword
