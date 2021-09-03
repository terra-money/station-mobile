import React, { ReactElement, useEffect } from 'react'
import { Keyboard, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useRecoilValue } from 'recoil'
import _ from 'lodash'
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native'

import { ConfirmProps, User } from 'lib'

import Body from 'components/layout/Body'
import WithAuth from 'components/layout/WithAuth'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import { UseStationForm, Button, LoadingIcon } from 'components'

import { RootStackParams } from 'types/navigation'

import ConfirmStore from 'stores/ConfirmStore'
import { useConfirm } from 'hooks/useConfirm'
import { useLoading } from 'hooks/useLoading'

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
  const { getComfirmData, initConfirm } = useConfirm()
  const { showLoading, hideLoading } = useLoading()
  const { result, form, fee } = getComfirmData({ confirm, user })

  const { navigate, dispatch } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  // during form is submitting, show loading
  useEffect(() => {
    form.submitting ? showLoading() : hideLoading()
  }, [form.submitting])

  // result will set after form.onSubmit or error
  useEffect(() => {
    if (result) {
      dispatch(StackActions.popToTop())
      navigate('Complete', { result })
      initConfirm()
    }
  }, [result])

  useEffect(() => {
    if (_.some(fee.select.options)) {
      fee.select.setValue(feeSelectValue)
    }
  }, [fee.select.options])

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
        {_.some(fee.status) ? (
          <View style={{ marginTop: 20 }}>
            <LoadingIcon size={24} />
          </View>
        ) : (
          <UseStationForm form={form} />
        )}

        <View>
          <Button
            theme={'sapphire'}
            disabled={form.disabled}
            title={form.submitLabel}
            onPress={(): void => {
              Keyboard.dismiss()
              form.onSubmit && form.onSubmit()
            }}
          />
        </View>
      </Body>
    </>
  )
}

const ConfirmPassword = (props: Props): ReactElement => {
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

ConfirmPassword.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default ConfirmPassword
