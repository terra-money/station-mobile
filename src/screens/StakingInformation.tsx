import React, { ReactElement } from 'react'
import { Linking, StyleSheet, View } from 'react-native'

import { navigationHeaderOptions } from 'components/layout/Header'
import { Button, Text } from 'components'
import Body from 'components/layout/Body'

const Screen = (): ReactElement => {
  return (
    <Body
      theme={'white'}
      containerStyle={{
        justifyContent: 'space-between',
        paddingBottom: 40,
      }}
    >
      <View>
        <Text style={styles.title} fontType={'bold'}>
          Staking rewards
        </Text>
        <Text style={styles.contents}>
          {`Rewards from stake are determined largely by the relative size of stake, and are structured in such a way that rewards increase as transaction volume increases. Luna ownership is thus an investment in the long term growth of Terra.
        
Staking rewards come from three sources: gas (compute fees), taxes, and seigniorage rewards.`}
        </Text>
      </View>
      <Button
        title={'Learn more'}
        theme={'sapphire'}
        onPress={(): void => {
          Linking.openURL(
            'https://docs.terra.money/luna.html#what-is-luna'
          )
        }}
      />
    </Body>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  theme: 'white',
  goBackIconType: 'close',
})

export default Screen

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: 0,
    paddingVertical: 20,
  },
  contents: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
})
