import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { COLOR } from 'consts'

import Body from 'components/layout/Body'
import { Text, Icon, Button } from 'components'
import { ConnectLedgerStackParams } from 'types'
import { useAuth } from 'lib'
import { settings } from 'utils/storage'

type Props = StackScreenProps<
  ConnectLedgerStackParams,
  'LedgerConnected'
>

const LedgerConnected = ({ route }: Props): ReactElement => {
  const wallet = route.params?.wallet

  const { signIn } = useAuth()

  const onPressButton = (): void => {
    signIn(wallet)
    settings.set({ walletName: wallet.name })
  }

  return (
    <Body containerStyle={styles.container}>
      <View style={styles.infoSection}>
        <Icon
          name={'account-balance-wallet'}
          size={60}
          color={COLOR.primary._02}
        />
        <Text style={styles.infoTitle} fontType={'bold'}>
          {'Ledger Connected!'}
        </Text>
        <Text
          style={{ color: COLOR.primary._02, textAlign: 'center' }}
        >
          {'Welcome aboard to Terra Station'}
        </Text>
      </View>
      <Button
        theme={'sapphire'}
        title={'Explore the Terra network'}
        onPress={onPressButton}
      />
    </Body>
  )
}

export default LedgerConnected

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
    fontStyle: 'normal',
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: 'center',
    color: COLOR.primary._02,
    marginVertical: 5,
  },
})
