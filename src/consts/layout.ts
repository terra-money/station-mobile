import { Platform, Dimensions } from 'react-native'
import { hasNotch } from 'react-native-device-info'

// Must be function to respond the change of divice width: galaxy-fold
const getWindowHeight = (): number => Dimensions.get('window').height
const getWindowWidth = (): number => Dimensions.get('window').width
const getScreenWideType = (): 'narrow' | 'normal' | 'wide' =>
  getWindowWidth() >= 768
    ? 'wide'
    : getWindowWidth() <= 320
    ? 'narrow'
    : 'normal'

const getNotchCoverPaddingBottom =
  Platform.OS === 'ios' && hasNotch() ? 54 : 32

export default {
  getWindowHeight,
  getWindowWidth,
  getScreenWideType,
  getNotchCoverPaddingBottom,
}
