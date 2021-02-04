import { Platform } from 'react-native'
import {
  checkMultiple,
  openSettings,
  PERMISSIONS,
  request,
} from 'react-native-permissions'

type PermissionResult =
  | 'unavailable'
  | 'blocked'
  | 'denied'
  | 'granted'
  | 'limited'

export const requestPermission = async (): Promise<PermissionResult> => {
  const permissions =
    Platform.OS === 'ios' ? PERMISSIONS.IOS : PERMISSIONS.ANDROID

  return request(permissions.CAMERA)
}

export const openPermissionSettings = (): void => {
  openSettings().catch(() => {
    // error handling
  })
}

export const checkCameraPermission = async (): Promise<PermissionResult> => {
  const permissions =
    Platform.OS === 'ios' ? PERMISSIONS.IOS : PERMISSIONS.ANDROID

  const statuses = await checkMultiple([permissions.CAMERA])
  return statuses[permissions.CAMERA]
}
