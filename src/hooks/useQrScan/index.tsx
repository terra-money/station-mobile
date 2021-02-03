import { useApp } from 'hooks/useApp'
import { BarCodeReadEvent } from 'react-native-camera'

import QRScan from './QRScan'

export const useQRScan = (): {
  openQRScan: ({
    onRead,
  }: {
    onRead: (event: BarCodeReadEvent) => void
  }) => void
} => {
  const { modal } = useApp()

  const openQRScan = ({
    onRead,
  }: {
    onRead: (event: BarCodeReadEvent) => void
    validator?: (event: BarCodeReadEvent) => string // return error message
  }): void => {
    modal.open(
      QRScan({
        ...modal,
        onRead,
      })
    )
  }

  return {
    openQRScan,
  }
}
