import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'

import {
  User,
  useDelegate as useStationDelegate,
} from 'use-station/src'
import { DelegateType } from 'use-station/src/post/useDelegate'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import { RootStackParams } from 'types/navigation'
import WithAuth from 'components/layout/WithAuth'
import UseStationForm from 'components/UseStationForm'
import Button from 'components/Button'

import { useConfirm } from 'hooks/useConfirm'

type Props = StackScreenProps<RootStackParams, 'Delegate'>

const Render = ({
  user,
  validatorAddress,
  type,
}: {
  user: User
  validatorAddress: string
  type: DelegateType
}): ReactElement => {
  const { navigateToConfirm } = useConfirm()
  const { loading, form, confirm } = useStationDelegate(user, {
    validatorAddress,
    type,
  })

  if (type === DelegateType.U && confirm) {
    confirm.warning = `Undelegation Warning : Undelegation takes 21 days to complete. Rewards will not be earned during this time.`
  }

  return loading ? (
    <View />
  ) : form ? (
    <>
      <SubHeader theme={'sapphire'} title={form.title} />
      <Body
        theme={'sky'}
        scrollable
        containerStyle={{
          paddingTop: 20,
          justifyContent: 'space-between',
          marginBottom: 40,
        }}
      >
        <View>
          <UseStationForm form={form} />
        </View>

        <Button
          theme={'sapphire'}
          disabled={form.disabled}
          title={form.submitLabel}
          onPress={(): void => {
            confirm &&
              navigateToConfirm({
                confirm,
              })
          }}
          containerStyle={{ marginTop: 20 }}
        />
      </Body>
    </>
  ) : (
    <View />
  )
}

const Delegate = (props: Props): ReactElement => {
  return (
    <WithAuth>
      {(user): ReactElement => (
        <Render {...{ ...props.route.params, user }} />
      )}
    </WithAuth>
  )
}

Delegate.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default Delegate
