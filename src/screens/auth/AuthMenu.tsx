import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const AuthMenu = () => {
  const { navigate } = useNavigation()

  return (
    <>
      <TouchableOpacity onPress={() => navigate('Select')}>
        <Text>Select wallet</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigate('New')}>
        <Text>New wallet</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigate('Add')}>
        <Text>Add existing wallet</Text>
      </TouchableOpacity>
    </>
  )
}

export default AuthMenu
