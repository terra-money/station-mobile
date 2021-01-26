import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'

import {
  User,
  useDelegate as useStationDelegate,
} from 'use-station/src'

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
  isUndelegation,
}: {
  user: User
  validatorAddress: string
  isUndelegation: boolean
}): ReactElement => {
  const { navigateToConfirm } = useConfirm()
  const { loading, form, confirm } = useStationDelegate(user, {
    validatorAddress,
    isUndelegation,
  })

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

const Screen = (props: Props): ReactElement => {
  return (
    <WithAuth>
      {(user): ReactElement => (
        <Render {...{ ...props.route.params, user }} />
      )}
    </WithAuth>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default Screen
