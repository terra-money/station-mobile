import React, { ReactElement, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'

import { COLOR } from 'consts'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import { Button, Text, Icon, Loading, Error } from 'components'

import { ConnectLedgerStackParams } from 'types'

const DeviceButton = ({
  name,
  id,
}: {
  name: string
  id: string
}): ReactElement => {
  const { navigate } =
    useNavigation<NavigationProp<ConnectLedgerStackParams>>()

  return (
    <Button
      title={
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingHorizontal: 30,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              letterSpacing: 0,
            }}
            fontType={'medium'}
          >
            {name}
          </Text>

          <Icon
            name={'bluetooth'}
            size={24}
            color={COLOR.primary._02}
          />
        </View>
      }
      theme={'white'}
      containerStyle={{
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#d2d9f0',
      }}
      onPress={(): void => navigate('SelectPath', { device: id })}
    />
  )
}

interface DeviceInterface {
  name: string
  id: string
}

const SelectDevice = (): ReactElement => {
  const [isScanning, setScanning] = useState(false);
  const [error, setError] = useState('')
  const [devices, setDevices] = useState<DeviceInterface[]>([])

  useEffect(() => {
    let stopScan = () => {};
    const subscription = TransportBLE.observeState({
      next: (e: any) => {
        if (e.available) {
          setScanning(true)
          setError('')

          const scan = TransportBLE.listen({
            complete: () => {
              setScanning(false)
            },
            next: (e: any) => {
              console.log(e)
              if (e.type === 'add') {
                const device: DeviceInterface = {
                  name: e.descriptor.localName || e.descriptor.name,
                  id: e.descriptor.id,
                };
                setDevices([...devices, device])
              }
            },
            error: (error: any) => {
              setScanning(false)
              setError(error)
            },
          })
          stopScan = () => { scan.unsubscribe() }
          
        } else {
          setError(e.type)
        }
      },
      complete: () => {},
      error: (error: any) => {
        setScanning(false)
        setError(error)
      },
    })

    return () => { subscription.unsubscribe(); stopScan() }
  }, [])

  return (
    <>
      <SubHeader theme={'sapphire'} title={'Select device'} />
      <Body theme={'sky'} containerStyle={styles.container}>
        <View>
          {
            devices.map(d => <DeviceButton name={d.name} id={d.id} key={d.id} />)
          }
          {
            isScanning ? <Loading /> : <></>
          }
        </View>

        {error ? 
          <Error title='Error during the connection' content={error} /> :
          <></>
        }
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
