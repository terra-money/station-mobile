import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import Icon from 'components/Icon'
import Body from 'components/layout/Body'
import { Text } from 'components'
import Button from 'components/Button'
import color from 'styles/color'

const Screen = (): ReactElement => {
  const { navigate } = useNavigation()
  return (
    <Body containerStyle={styles.container}>
      <View style={styles.infoSection}>
        <Icon
          name={'account-balance-wallet'}
          size={60}
          color={color.sapphire}
        />
        <Text style={styles.infoTitle}>Wallet Recovered!</Text>
        <Text style={{ color: color.sapphire }}>
          Welcome back to Terra Station
        </Text>
      </View>
      <Button
        theme={'sapphire'}
        title={'Explore The Terra Network'}
        onPress={(): void => navigate('Tabs')}
      />
    </Body>
  )
}

export default Screen

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  infoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: 'center',
    color: color.sapphire,
  },
})
