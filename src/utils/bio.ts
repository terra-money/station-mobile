import * as LocalAuthentication from 'expo-local-authentication'
import { Platform } from 'react-native'
import { checkFaceIdPermission } from './permission'

export enum BiometricType {
  NONE,
  FACE,
  FINGERPRINT,
}

export const isSupportedBiometricAuthentication = async (): Promise<boolean> => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync()
  const supportedAuthenticationTypes = await LocalAuthentication.supportedAuthenticationTypesAsync()
  const isEnrolled = await LocalAuthentication.isEnrolledAsync()

  return (
    (hasHardware &&
      supportedAuthenticationTypes.length > 0 &&
      isEnrolled) ||
    (Platform.OS === 'ios' &&
      supportedAuthenticationTypes.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      ) &&
      (await checkFaceIdPermission()) === 'blocked')
  )
}

export const getSupportedType = async (): Promise<BiometricType> => {
  if (!(await isSupportedBiometricAuthentication())) {
    return BiometricType.NONE
  }

  const supportedAuthenticationTypes = await LocalAuthentication.supportedAuthenticationTypesAsync()
  if (supportedAuthenticationTypes.length > 0) {
    if (
      supportedAuthenticationTypes.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      )
    ) {
      return BiometricType.FINGERPRINT
    } else if (
      supportedAuthenticationTypes.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      )
    ) {
      return BiometricType.FACE
    }
  }

  return BiometricType.NONE
}

export const authenticateBiometric = async (): Promise<boolean> => {
  const ret = await LocalAuthentication.authenticateAsync({
    promptMessage: ' ',
    cancelLabel: 'CANCEL',
    disableDeviceFallback: true,
    fallbackLabel: '',
  })

  return ret.success
}
