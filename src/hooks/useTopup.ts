import {
  CommonActions,
  StackActions,
  useNavigation,
} from '@react-navigation/native'
import { useAlert } from './useAlert'
import useLinking from './useLinking'

export const useTopup = (): {
  restoreApp: (returnScheme: string) => Promise<void>
  gotoWallet: () => void
  gotoDashboard: () => void
} => {
  const { alert } = useAlert()
  const { dispatch } = useNavigation()
  const { openURL } = useLinking()

  const gotoWallet = (): void => {
    dispatch(StackActions.replace('AuthMenu'))
  }

  const gotoDashboard = (): void => {
    dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: 'Tabs' }],
      })
    )
  }

  const restoreApp = async (returnScheme: string): Promise<void> => {
    try {
      await openURL(returnScheme)
    } catch (e) {
      alert({ title: 'Unexpected Error', desc: e.toString() })
    } finally {
      gotoDashboard()
    }
  }

  return {
    restoreApp,
    gotoWallet,
    gotoDashboard,
  }
}
