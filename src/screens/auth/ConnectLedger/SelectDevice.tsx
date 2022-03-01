import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'

import { ConnectLedgerStackParams } from 'types'
import DeviceSelector from './DeviceSelector'

const SelectDevice = (): ReactElement => {
  const { navigate } =
  useNavigation<NavigationProp<ConnectLedgerStackParams>>()

  return (
    <>
      <SubHeader theme={'sapphire'} title={'Select device'} />
      <Body theme={'sky'} containerStyle={styles.container}>
        <DeviceSelector onSubmit={(id: string): void => navigate('SelectPath', { device: id })} />
      </Body>
    </>
  )
}

SelectDevice.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default SelectDevice

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    paddingTop: 20,
  },
})
