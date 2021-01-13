import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '@terra-money/use-native-station'
import { settings } from '../../utils/storage'

export default (): void => {
  const { goBack } = useNavigation()
  const { user } = useAuth()

  useEffect(() => {
    user ? settings.set({ user }) : settings.delete(['user'])
    user && goBack()
  }, [user])
}
