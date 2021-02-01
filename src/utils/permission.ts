import { Platform } from 'react-native'
import {
  checkMultiple,
  openSettings,
  PERMISSIONS,
} from 'react-native-permissions'

type PermissionResult =
  | 'unavailable'
  | 'blocked'
  | 'denied'
  | 'granted'
  | 'limited'

const openPermissionSettings = (): void => {
  openSettings().catch(() => {
    // error handling
  })
}

const checkCameraPermission = async (): Promise<PermissionResult> => {
  const permissions =
    Platform.OS === 'ios' ? PERMISSIONS.IOS : PERMISSIONS.ANDROID

  const statuses = await checkMultiple([permissions.CAMERA])
  return statuses[permissions.CAMERA]
}
