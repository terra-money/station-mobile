import React, { ReactElement, useEffect } from 'react'
import { View } from 'react-native'
import { useAuth } from 'use-station/src'
import { settings } from 'utils/storage'

const AutoLogout = (): ReactElement => {
  const { signOut } = useAuth()
  useEffect(() => {
    settings.delete(['walletName'])
    signOut()
  }, [])
  return <View />
}

export default AutoLogout
