import React, { ReactElement } from 'react'
import {
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useInfo, Trans } from 'use-station/src'

import Card from './Card'
import { Text } from 'components'
import color from 'styles/color'

const PleaseSignIn = (): ReactElement => {
  const { navigate } = useNavigation()
  const { SIGN_IN_REQUIRED } = useInfo()
  const { title, i18nKey, button } = SIGN_IN_REQUIRED

  return (
    <Card>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>
        <Trans i18nKey={i18nKey}>
          <Text />
        </Trans>
      </Text>
      <TouchableWithoutFeedback
        onPress={(): void => navigate('AuthMenu')}
      >
        <View style={styles.button}>
          <Text style={styles.button_text}>{button}</Text>
        </View>
      </TouchableWithoutFeedback>
    </Card>
  )
}

const styles = StyleSheet.create({
  title: {
    color: color.sapphire,
    fontSize: 18,
    lineHeight: 27,
    marginBottom: 5,
  },
  content: {
    color: color.sapphire,
    fontSize: 14,
    lineHeight: 21,
  },
  button: {
    backgroundColor: color.sapphire,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginTop: 40,
  },
  button_text: {
    color: '#fff',
    fontSize: 16,
  },
})

export default PleaseSignIn
