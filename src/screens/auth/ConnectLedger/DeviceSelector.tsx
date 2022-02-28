import React, { ReactElement, useEffect, useState } from 'react'
import { View, ViewStyle } from 'react-native'
import _ from 'lodash'
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'

import { COLOR } from 'consts'
import { Button, Text, Icon, Loading, Error } from 'components'

const DeviceButton = ({
  name,
  id,
  onPress,
}: {
  name: string
  id: string
  onPress: (id: string) => void
}): ReactElement => {
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
      onPress={() => onPress(id)}
    />
  )
}

interface DeviceInterface {
  name: string
  id: string
}

const DeviceSelector = ({
  onSubmit,
  style
}: {
  onSubmit: (id: string) => void
  style?: ViewStyle
}): ReactElement => {
  const [isScanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const [devices, setDevices] = useState<DeviceInterface[]>([])

  useEffect(() => {
    let stopScan = () => {}
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
              if (e.type === 'add') {
                const device: DeviceInterface = {
                  name: e.descriptor.localName || e.descriptor.name,
                  id: e.descriptor.id,
                }
                setDevices([...devices, device])
              }
            },
            error: (error: any) => {
              setScanning(false)
              setError(error)
            },
          })
          stopScan = () => {
            scan.unsubscribe()
          }
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

    return () => {
      subscription.unsubscribe()
      stopScan()
    }
  }, [])

  return (
    <View style={style}>
      <View>
        {devices.map((d) => (
          <DeviceButton name={d.name} id={d.id} key={d.id} onPress={onSubmit}/>
        ))}
        {isScanning ? <Loading /> : <></>}
      </View>

      {error ? (
        <Error title="Bluetooth error" content={error} />
      ) : (
        <></>
      )}
    </View>
  )
}

export default DeviceSelector
