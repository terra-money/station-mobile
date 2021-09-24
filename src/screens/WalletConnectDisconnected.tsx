import React, { ReactElement } from 'react'
import { View, StyleSheet } from 'react-native'
import { StackActions, useNavigation } from '@react-navigation/native'

import Body from 'components/layout/Body'
import { Text, Icon, Button } from 'components'
import color from 'styles/color'
import { useAuth } from 'lib'

const WalletConnectDisconnected = (): ReactElement => {
  const { goBack, canGoBack, dispatch } = useNavigation()
  const { user } = useAuth()
  const onPressGoBack = (): void => {
    if (canGoBack()) {
      goBack()
    } else {
      user
        ? dispatch(StackActions.replace('Tabs'))
        : dispatch(StackActions.replace('AuthMenu'))
    }
  }

  return (
    <Body>
      <View style={styles.body}>
        <Icon size={60} color={color.sapphire} name={'wifi-off'} />
        <Text
          style={{ fontSize: 24, marginVertical: 5 }}
          fontType={'bold'}
        >
          Reconnection Required
        </Text>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            textAlign: 'center',
          }}
        >
          1. Check that the correct wallet is logged into your Terra
          Station.
        </Text>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            textAlign: 'center',
          }}
        >
          2. Disconnect your wallet from the web app and try
          reconnecting.
        </Text>
      </View>
      <Button
        theme={'sapphire'}
        title={'OK'}
        onPress={onPressGoBack}
        containerStyle={{ marginBottom: 40 }}
      />
    </Body>
  )
}

export default WalletConnectDisconnected

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
