import React, { useState, ReactElement } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { COLOR } from 'consts'
import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import {
  Button,
  FormInput,
  FormLabel,
  Error,
  Loading,
} from 'components'

import { StackScreenProps } from '@react-navigation/stack'
import { ConnectLedgerStackParams } from 'types'
import { addWallet } from 'utils/wallet'

import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'
import { LedgerKey } from '@terra-money/ledger-terra-js'

type Props = StackScreenProps<ConnectLedgerStackParams, 'SelectPath'>

const SelectPath = ({ route }: Props): ReactElement => {
  const { navigate } =
    useNavigation<NavigationProp<ConnectLedgerStackParams>>()

  const [path, setPath] = useState('0')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onChangePath = (p: string): void => {
    setPath(p.replace(/[^0-9]/g, ''))
  }

  const onPressNext = async (): Promise<void> => {
    setLoading(true)

    try {
      const wallet = await LedgerKey.create(
        await TransportBLE.open(route.params.device),
        parseInt(path)
      )

      await addWallet({
        wallet: {
          address: wallet.accAddress,
          name: 'Ledger',
          ledger: true,
          path: parseInt(path),
        },
      })

      navigate('LedgerConnected', {
        wallet: {
          address: wallet.accAddress,
          name: 'Ledger',
          ledger: true,
          path: parseInt(path),
        },
      })

      // disconnect ledger
      TransportBLE.disconnect(route.params.device)
    } catch (e: any) {
      setLoading(false)
      setError(e.toString())
    }
  }

  return (
    <>
      <SubHeader theme={'sapphire'} title={'Select Path'} />
      <Body theme={'sky'} containerStyle={styles.container}>
        {loading ? (
          <Loading />
        ) : (
          <>
            <View>
              <View style={styles.section}>
                <FormLabel text={'Derivation path'} />
                <FormInput
                  underlineColorAndroid="#ccc"
                  value={path}
                  onChangeText={onChangePath}
                  placeholder={
                    'Enter the derivation path (default 0)'
                  }
                  keyboardType="numeric"
                />
              </View>
              {path !== '0' ? (
                <View
                  style={{
                    opacity: 0.91,
                    borderRadius: 8,
                    backgroundColor: '#ebeff8',
                    paddingHorizontal: 20,
                    paddingVertical: 15,
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      lineHeight: 18,
                      letterSpacing: 0,
                      color: COLOR.primary._02,
                    }}
                  >
                    The default path is 0
                  </Text>
                </View>
              ) : (
                <></>
              )}
              {error ? (
                <Error title="Ledger Error" content={error} />
              ) : (
                <></>
              )}
            </View>
            <Button
              title="Next"
              theme={'sapphire'}
              containerStyle={{ marginBottom: 10 }}
              disabled={!path}
              onPress={onPressNext}
            />
          </>
        )}
      </Body>
    </>
  )
}

SelectPath.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default SelectPath

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  section: {
    marginBottom: 20,
  },
})
