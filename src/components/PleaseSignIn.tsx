import React from 'react'
import { Text } from 'react-native'
import { useInfo, Trans } from '@terra-money/use-native-station'
import Info from './Info'

const PleaseSignIn = ({ card }: { card?: boolean }) => {
  const { SIGN_IN_REQUIRED } = useInfo()
  const { title, i18nKey } = SIGN_IN_REQUIRED

  return (
    <Info icon="account-circle" title={title} card={card}>
      <Trans i18nKey={i18nKey}>
        <Text />
      </Trans>
    </Info>
  )
}

export default PleaseSignIn
