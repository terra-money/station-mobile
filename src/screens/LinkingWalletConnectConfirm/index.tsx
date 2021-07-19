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

type Props = StackScreenProps<
  RootStackParams,
  'LinkingWalletConnectConfirm'
>

const LinkingWalletConnectConfirm = ({
  route,
  navigation,
}: Props): ReactElement => {
  const { dispatch, navigate, goBack } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  const { validWalletConnectConfirmPayload } = usePayload()

  const run = async (): Promise<void> => {
    let alreadyWcConfirm = false
    let noParentRoute = false

    try {
      const currRoutes = navigation.dangerouslyGetState().routes
      noParentRoute = currRoutes.length === 1
      alreadyWcConfirm =
        currRoutes.length > 1 &&
        currRoutes[currRoutes.length - 2].name ===
          'WalletConnectConfirm'
    } catch {}

    const valid = await validWalletConnectConfirmPayload(
      route.params.payload
    )

    if (alreadyWcConfirm) {
      goBack()
    } else {
      if (valid.success) {
        if (noParentRoute) {
          dispatch(StackActions.replace('Tabs'))
          navigate('WalletConnectConfirm', valid.params)
        } else {
          dispatch(
            StackActions.replace('WalletConnectConfirm', valid.params)
          )
        }
      } else {
        dispatch(
          StackActions.replace('LinkingError', {
            errorMessage: valid.errorMessage,
          })
        )
      }
    }
  }

  useEffect(() => {
    run()
  }, [])
  return <View />
}

export default LinkingWalletConnectConfirm
