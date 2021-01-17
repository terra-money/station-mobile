import { NativeModules } from 'react-native'
import dev from './dev'

export const isDeviceRooted = async (): Promise<boolean> => {
  try {
    return await NativeModules.RootChecker.isDeviceRooted()
  } catch (e) {
    dev.log(e)
  }

  return true
}
