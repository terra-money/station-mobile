import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import Security from 'utils/security'

enum SECURITY_ERROR_CODE {
  NONE = 0,
  DEVICE_ROOTED = 1,
  DEBUG_ENABLED = 2,
  INCORRECT_FINGERPRINT = 4,
  RUNNING_EMULATOR = 8,
}

const DEFAULT_SECURITY_VALUE = __DEV__ ? false : undefined

const useSecurity = (): {
  getSecurityErrorMessage: () => string
  getSecurityErrorCode: () => SECURITY_ERROR_CODE
  securityCheckFailed: boolean | undefined
} => {
  /* root check */
  const [isDeviceRooted, setDeviceRooted] = useState<
    boolean | undefined
  >(DEFAULT_SECURITY_VALUE)

  /* debug check */
  const [isDebugEnabled, setDebugEnabled] = useState<
    boolean | undefined
  >(DEFAULT_SECURITY_VALUE)

  /* fingerprint check - android only */
  const [isIncorrectFingerprint, setIncorrectFingerprint] = useState<
    boolean | undefined
  >(DEFAULT_SECURITY_VALUE)

  /* emulator check - android only */
  const [isRunningEmulator, setRunningEmulator] = useState<
    boolean | undefined
  >(DEFAULT_SECURITY_VALUE)

  const [securityCheckFailed, setSecurityCheckFailed] = useState<
    boolean | undefined
  >()

  useEffect(() => {
    if (
      isDeviceRooted === undefined ||
      isDebugEnabled === undefined ||
      isIncorrectFingerprint === undefined ||
      isRunningEmulator === undefined
    ) {
      return
    }

    const check =
      isDeviceRooted ||
      isDebugEnabled ||
      isIncorrectFingerprint ||
      isRunningEmulator
    setSecurityCheckFailed(check)
  }, [
    isDeviceRooted,
    isDebugEnabled,
    isIncorrectFingerprint,
    isRunningEmulator,
  ])

  useEffect(() => {
    if (isDeviceRooted === undefined) {
      Security.deviceRooted().then((ret: boolean) => {
        setDeviceRooted(ret)
      })
    }

    if (isDebugEnabled === undefined) {
      Security.debugEnabled().then((ret: boolean) => {
        setDebugEnabled(ret)
      })
    }

    if (isIncorrectFingerprint === undefined) {
      if (Platform.OS === 'android') {
        Security.incorrectFingerprint().then((ret: boolean) => {
          setIncorrectFingerprint(ret)
        })
      } else {
        setIncorrectFingerprint(false)
      }
    }

    if (isRunningEmulator === undefined) {
      if (Platform.OS === 'android') {
        Security.runningEmulator().then((ret: boolean) => {
          setRunningEmulator(ret)
        })
      } else {
        setRunningEmulator(false)
      }
    }
  }, [])

  const getSecurityErrorMessage = (): string => {
    const ret = isDeviceRooted
      ? 'The device is rooted. For security reasons the application cannot be run from a rooted device.'
      : isDebugEnabled
      ? 'Developer debugging is turned on. Usage is restricted for security reasons.'
      : isIncorrectFingerprint
      ? 'Application signature is incorrect. Usage is restricted for security reasons.'
      : isRunningEmulator
      ? 'Application is currently being run on an emulator. Usage is restricted for security reasons.'
      : ''
    return ret
  }

  const getSecurityErrorCode = (): SECURITY_ERROR_CODE => {
    const ret = isDeviceRooted
      ? SECURITY_ERROR_CODE.DEVICE_ROOTED
      : isDebugEnabled
      ? SECURITY_ERROR_CODE.DEBUG_ENABLED
      : isIncorrectFingerprint
      ? SECURITY_ERROR_CODE.INCORRECT_FINGERPRINT
      : isRunningEmulator
      ? SECURITY_ERROR_CODE.RUNNING_EMULATOR
      : SECURITY_ERROR_CODE.NONE

    return ret
  }

  return {
    getSecurityErrorMessage,
    getSecurityErrorCode,
    securityCheckFailed,
  }
}

export default useSecurity
