import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BarCodeReadEvent } from 'react-native-camera'

import { useAlert } from 'hooks/useAlert'
import { useApp } from 'hooks/useApp'
import {
  checkCameraPermission,
  openPermissionSettings,
  requestPermission,
} from 'utils/permission'

import QRScan from './QRScan'

export const useQRScan = (): {
  openQRScan: ({
    onRead,
    checkPermission,
  }: {
    onRead: (event: BarCodeReadEvent) => void
    checkPermission?: (permission: boolean) => void
  }) => void
} => {
  const { modal } = useApp()
  const { confirm } = useAlert()
  const insets = useSafeAreaInsets()

  const openQRScan = async ({
    onRead,
    checkPermission,
  }: {
    onRead: (event: BarCodeReadEvent) => void
    checkPermission?: (permission: boolean) => void
  }): Promise<void> => {
    const requestResult = await requestPermission()
    if (requestResult === 'granted') {
      const permission = await checkCameraPermission()
      checkPermission && checkPermission(permission === 'granted')
      if (permission === 'granted') {
        modal.open(
          QRScan({
            ...modal,
            onRead,
            marginTop: insets.top,
          })
        )
      }
    } else {
      confirm({
        title: 'Camera not authorized',
        desc: 'Do you want to go setting for camera permission?',
        onPressConfirm: (): void => {
          openPermissionSettings()
        },
      })
    }
  }

  return {
    openQRScan,
  }
}
