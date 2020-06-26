import React from 'react'
import { TouchableWithoutFeedback, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useInfo, Trans } from '@terra-money/use-native-station'
import Info from './Info'

const PleaseSignIn = ({ card }: { card?: boolean }) => {
  const { navigate } = useNavigation()
  const { SIGN_IN_REQUIRED } = useInfo()
  const { title, i18nKey, button } = SIGN_IN_REQUIRED

  return (
    <Info title={title} card={card}>
      <Trans i18nKey={i18nKey}>
        <Text />
      </Trans>

      <TouchableWithoutFeedback onPress={() => navigate('AuthMenu')}>
        <Text>{button}</Text>
      </TouchableWithoutFeedback>
    </Info>
  )
}

export default PleaseSignIn
