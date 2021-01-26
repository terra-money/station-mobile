import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useRecoilValue } from 'recoil'
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native'

import { ConfirmProps, User } from 'use-station/src'

import Body from 'components/layout/Body'
import WithAuth from 'components/layout/WithAuth'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import { UseStationForm, Button, BiometricButton } from 'components'

import { RootStackParams } from 'types/navigation'

import ConfirmStore from 'stores/ConfirmStore'
import { getIsUseBioAuth } from 'utils/storage'
import { useConfirm } from 'hooks/useConfirm'

type Props = StackScreenProps<RootStackParams, 'ConfirmPassword'>

const Render = ({
  confirm,
  user,
  route,
}: {
  user: User
  confirm: ConfirmProps
} & Props): ReactElement => {
  const feeSelectValue = route.params.feeSelectValue
  const { getComfirmData } = useConfirm()
  const { result, form, fee } = getComfirmData({ confirm, user })

  const { navigate, dispatch } = useNavigation<
    NavigationProp<RootStackParams>
  >()
  const [isUseBioAuth, setIsUseBioAuth] = useState(false)
  const [bioAuthTrigger, setBioAuthTrigger] = useState(0)

  const onPressBiometricButton = ({
    isSuccess,
    password,
  }: {
    isSuccess: boolean
    password: string
  }): void => {
    if (isSuccess) {
      if (form.fields[0]?.setValue) {
        form.fields[0]?.setValue(password)
        setBioAuthTrigger((ori) => ori + 1)
      }
    }
  }

  // for Bio Auth, bioauthTrigger or form will change after bio auth
  useEffect(() => {
    fee.select.setValue(feeSelectValue)
    if (bioAuthTrigger) {
      form.onSubmit && form.onSubmit()
    }
  }, [form.disabled, bioAuthTrigger])

  // result will set after form.onSubmit or error
  useEffect(() => {
    if (result) {
      dispatch(StackActions.popToTop())
      navigate('Complete', { result })
    }
  }, [result])

  useEffect(() => {
    getIsUseBioAuth().then((isUse) => {
      setIsUseBioAuth(isUse)
    })
  }, [])

  return (
    <>
      <SubHeader theme={'sapphire'} title={form.title} />
      <Body
        theme={'sky'}
        containerStyle={{
          justifyContent: 'space-between',
          marginBottom: 40,
        }}
      >
        <UseStationForm form={form} />

        <View>
          <Button
            theme={'sapphire'}
            disabled={form.disabled}
            title={form.submitLabel}
            onPress={form.onSubmit}
          />
          {isUseBioAuth && (
            <View style={{ marginTop: 10 }}>
              <BiometricButton
                disabled={form.submitting}
                walletName={user.name || ''}
                onPress={onPressBiometricButton}
              />
            </View>
          )}
        </View>
      </Body>
    </>
  )
}

const Screen = (props: Props): ReactElement => {
  const confirm = useRecoilValue(ConfirmStore.confirm)

  return (
    <WithAuth>
      {(user): ReactElement => (
        <>
          {confirm ? (
            <Render {...{ ...props, confirm, user }} />
          ) : null}
        </>
      )}
    </WithAuth>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default Screen
