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

type Props = StackScreenProps<RootStackParams, 'LinkingSend'>

const LinkingSend = ({ route, navigation }: Props): ReactElement => {
  const { dispatch, navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  const { validSendPayload } = usePayload()

  const run = async (): Promise<void> => {
    let alreadySend = false
    let noParentRoute = false
    try {
      const currRoutes = navigation.dangerouslyGetState().routes
      noParentRoute = currRoutes.length === 1
      alreadySend = currRoutes[currRoutes.length - 2].name === 'Send'
    } catch {}

    const valid = await validSendPayload(route.params.payload)
    if (valid.success) {
      alreadySend && dispatch(StackActions.pop(1))

      if (noParentRoute) {
        dispatch(StackActions.replace('Tabs'))
        navigate('Send', valid.params)
      } else {
        dispatch(StackActions.replace('Send', valid.params))
      }
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

export default LinkingSend
