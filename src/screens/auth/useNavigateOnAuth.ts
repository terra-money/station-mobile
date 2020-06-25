import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '@terra-money/use-native-station'

export default () => {
  const { goBack } = useNavigation()
  const { user } = useAuth()

  useEffect(() => {
    user && goBack()
  }, [user])
}
