import React, { ReactElement, useEffect } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View } from 'react-native'
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native'

import { RootStackParams } from 'types/navigation'
import usePayload from 'hooks/usePayload'

type Props = StackScreenProps<RootStackParams, 'LinkingWalletConnect'>

const LinkingWalletConnect = ({ route }: Props): ReactElement => {
  const { dispatch } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  const { validWalletConnectPayload } = usePayload()

  const run = async (): Promise<void> => {
    const valid = await validWalletConnectPayload(
      route.params.payload
    )
    if (valid.success) {
      dispatch(StackActions.replace('WalletConnect', valid.params))
    } else {
      dispatch(
        StackActions.replace('LinkingError', {
          errorMessage: valid.errorMessage,
        })
      )
    }
  }

  useEffect(() => {
    run()
  }, [])
  return <View />
}

export default LinkingWalletConnect
