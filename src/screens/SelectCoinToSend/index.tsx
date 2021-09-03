import React, { ReactElement } from 'react'
import {
  StackNavigationOptions,
  StackScreenProps,
} from '@react-navigation/stack'
import { User } from 'lib'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import WithAuth from 'components/layout/WithAuth'

import { RootStackParams } from 'types/navigation'

import AvailableAssets from './AvailableAssets'

type Props = StackScreenProps<RootStackParams, 'SelectCoinToSend'>

const Render = ({
  user,
  route,
}: { user: User } & Props): ReactElement => {
  const toAddress = route.params?.toAddress
  return (
    <>
      <SubHeader theme={'sapphire'} title={'Select a coin to send'} />
      <Body
        theme={'sky'}
        scrollable
        containerStyle={{
          paddingTop: 20,
          justifyContent: 'space-between',
          marginBottom: 40,
        }}
      >
        <AvailableAssets {...{ user, toAddress }} />
      </Body>
    </>
  )
}

const SelectCoinToSend = (props: Props): ReactElement => {
  return (
    <WithAuth>
      {(user): ReactElement => <Render {...{ ...props, user }} />}
    </WithAuth>
  )
}

SelectCoinToSend.navigationOptions = (): StackNavigationOptions => {
  return navigationHeaderOptions({
    theme: 'sapphire',
  })
}

export default SelectCoinToSend
