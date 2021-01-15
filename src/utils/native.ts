import { NativeModules } from 'react-native'

export const isDeviceRooted = async (): Promise<boolean> => {
  try {
    return await NativeModules.RootChecker.isDeviceRooted()
  } catch (e) {
    console.log(e)
  }

  return true
}
