import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useInfo, Trans } from 'use-station/src'

import Card from './Card'
import { Button, Text } from 'components'

const PleaseSignIn = (): ReactElement => {
  const { navigate } = useNavigation()
  const { SIGN_IN_REQUIRED } = useInfo()
  const { title, i18nKey } = SIGN_IN_REQUIRED

  return (
    <Card>
      <Text style={styles.title} fontType={'bold'}>
        {title}
      </Text>
      <Text style={styles.content}>
        <Trans i18nKey={i18nKey}>
          <Text />
        </Trans>
      </Text>
      <Button
        onPress={(): void => navigate('AuthMenu')}
        titleStyle={styles.button_text}
        title={'Connect'}
        theme={'sapphire'}
        size="sm"
      />
    </Card>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    marginBottom: 5,
  },
  content: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    marginBottom: 30,
  },
  button_text: {
    color: '#fff',
  },
})

export default PleaseSignIn
