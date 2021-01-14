import React, { ReactElement } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Body from 'components/layout/Body'
import Button from 'components/Button'
import { useNavigation } from '@react-navigation/native'

const Screen = (): ReactElement => {
  const { navigate } = useNavigation()
  return (
    <Body containerStyle={styles.container}>
      <View>
        <Text>Wallet Created!</Text>
      </View>
      <Button
        type={'blue'}
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
})
