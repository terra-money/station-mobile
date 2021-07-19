import { useEffect } from 'react'
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging'
import { NativeModules, Platform } from 'react-native'
import dev from 'utils/dev'

export type FcmMessage = FirebaseMessagingTypes.RemoteMessage

export const useFcm = (
  onMessage?: (remoteMessage: FcmMessage) => void,
  onBackgroundMessage?: (message: FcmMessage) => void
): {
  hasPermission: () => Promise<boolean>
  requestPermission: () => Promise<boolean>
  getToken: () => Promise<string | undefined>
  clearNotification: () => Promise<void>
  moveNotificationSettings: () => Promise<void>
} => {
  const hasPermission = async (): Promise<boolean> => {
    const status = await messaging().hasPermission()
    const enabled =
      status === messaging.AuthorizationStatus.AUTHORIZED ||
      status === messaging.AuthorizationStatus.PROVISIONAL

    dev.log(`permission -> status: ${status}, enabled: ${enabled}`)
    return enabled
  }

  /** iOS Only */
  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      return await hasPermission()
    }

    const status = await messaging().requestPermission()
    const enabled =
      status === messaging.AuthorizationStatus.AUTHORIZED ||
      status === messaging.AuthorizationStatus.PROVISIONAL

    dev.log(`request -> status: ${status}, enabled: ${enabled}`)
    return enabled
  }

  const getToken = async (): Promise<string | undefined> => {
    try {
      return await messaging().getToken()
    } catch (e) {}
  }

  const clearNotification = async (): Promise<void> => {
    try {
      await NativeModules.PushNotificationManager.clearNotification()
    } catch (e) {}
  }

  const moveNotificationSettings = async (): Promise<void> => {
    try {
      await NativeModules.PushNotificationManager.moveNotificationSettings()
    } catch (e) {}
  }

  useEffect(() => {
    return onMessage
      ? messaging().onMessage(async (remoteMessage) => {
          onMessage(remoteMessage)
        })
      : undefined
  }, [])

  useEffect(() => {
    return onBackgroundMessage
      ? messaging().setBackgroundMessageHandler(async (message) => {
          onBackgroundMessage(message)
        })
      : undefined
  }, [])

  return {
    hasPermission,
    requestPermission,
    getToken,
    clearNotification,
    moveNotificationSettings,
  }
}
