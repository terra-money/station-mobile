import { NativeModules, Platform } from 'react-native'

const deviceRooted = async (): Promise<boolean> => {
  try {
    return await NativeModules.RootChecker.isDeviceRooted()
  } catch (e) {
    return false
  }
}

const debugEnabled = async (): Promise<boolean> => {
  try {
    return await NativeModules.TamperChecker.debugCheck()
  } catch (e) {
    return false
  }
}

/**
 * Android only
 */
const runningEmulator = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') return false

  try {
    return await NativeModules.EmulatorChecker.isEmulator()
  } catch (e) {
    return false
  }
}

/**
 * Android only
 */
const incorrectFingerprint = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') return false

  try {
    return !(await NativeModules.TamperChecker.fingerprintCheck())
  } catch (e) {
    return false
  }
}

/**
 * Android only
 */
const allowScreenCapture = async (): Promise<void> => {
  if (Platform.OS === 'android') {
    try {
      await NativeModules.PreventCapture.setCaptureEnable(true)
    } catch {}
  }
}

/**
 * Android only
 */
const disallowScreenCapture = async (): Promise<void> => {
  if (Platform.OS === 'android') {
    try {
      await NativeModules.PreventCapture.setCaptureEnable(false)
    } catch {}
  }
}

export default {
  deviceRooted,
  debugEnabled,
  runningEmulator,
  incorrectFingerprint,
  allowScreenCapture,
  disallowScreenCapture,
}
