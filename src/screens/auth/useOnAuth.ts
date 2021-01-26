import { useEffect } from 'react'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { useAuth } from 'use-station/src'
import { settings } from 'utils/storage'
import { RootStackParams } from 'types'

export default (): void => {
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()
  const { user } = useAuth()

  useEffect(() => {
    user ? settings.set({ user }) : settings.delete(['user'])
    user && navigate('Tabs')
  }, [user])
}
