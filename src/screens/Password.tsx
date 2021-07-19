import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import _ from 'lodash'
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native'

import { User } from 'use-station/src'

import Body from 'components/layout/Body'
import WithAuth from 'components/layout/WithAuth'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import { Button, FormInput, FormLabel } from 'components'

import { RootStackParams } from 'types/navigation'
import { testPassword } from 'utils/wallet'

type Props = StackScreenProps<RootStackParams, 'Password'>

const Render = ({
  user,
  route,
}: {
  user: User
} & Props): ReactElement => {
  const navigateAfter = route.params.navigateAfter

  const [inputPassword, setInputPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { dispatch } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  const onPressNext = async (): Promise<void> => {
    setErrorMessage('')
    const result = await testPassword({
      name: user.name || '',
      password: inputPassword,
    })
    if (result.isSuccess) {
      dispatch(
        StackActions.replace(navigateAfter, {
          password: inputPassword,
        })
      )
    } else {
      setErrorMessage('Incorrect password')
    }
  }

  return (
    <>
      <SubHeader theme={'sapphire'} title={'Enter your password'} />
      <Body
        theme={'sky'}
        containerStyle={{
          justifyContent: 'space-between',
          marginBottom: 40,
          paddingTop: 20,
        }}
      >
        <View>
          <FormLabel text="Password" />
          <FormInput
            errorMessage={errorMessage}
            value={inputPassword}
            onChangeText={setInputPassword}
            secureTextEntry
          />
        </View>

        <View>
          <Button
            disabled={_.isEmpty(inputPassword)}
            theme={'sapphire'}
            title={'Next'}
            onPress={onPressNext}
          />
        </View>
      </Body>
    </>
  )
}

const Password = (props: Props): ReactElement => {
  return (
    <WithAuth>
      {(user): ReactElement => <Render {...{ ...props, user }} />}
    </WithAuth>
  )
}

Password.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default Password
