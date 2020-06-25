import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '@terra-money/use-native-station'
import { clearSettings, clearKeys } from '../../utils/storage'
import { WithKeys } from '../../hooks'

interface MenuItem {
  text: string
  onPress: () => void
}

// TODO: Hide dev options
const AuthMenu = ({ canSelect }: { canSelect: boolean }) => {
  const { navigate } = useNavigation()
  const { user, signOut } = useAuth()

  const menu = [
    !user &&
      canSelect && { text: 'Select wallet', onPress: () => navigate('Select') },
    !user && { text: 'New wallet', onPress: () => navigate('New') },
    !user && { text: 'Add existing wallet', onPress: () => navigate('Add') },
    user && { text: 'Sign out', onPress: () => signOut() },
    { text: '(DEV) Clear settings', onPress: () => clearSettings() },
    { text: '(DEV) Clear keys', onPress: () => clearKeys() },
  ]

  const renderMenuItem = ({ text, onPress }: MenuItem) => (
    <TouchableOpacity onPress={onPress} key={text}>
      <Text>{text}</Text>
    </TouchableOpacity>
  )

  return <>{menu.map((item) => item && renderMenuItem(item))}</>
}

export default () => (
  <WithKeys render={({ keys }) => <AuthMenu canSelect={!!keys.length} />} />
)
