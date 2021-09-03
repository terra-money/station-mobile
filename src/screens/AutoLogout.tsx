import React, { ReactElement, useEffect } from 'react'
import { View } from 'react-native'
import { useSetRecoilState } from 'recoil'
import AutoLogoutStore from 'stores/AutoLogoutStore'
import { useAuth } from 'lib'
import { settings } from 'utils/storage'

const AutoLogout = (): ReactElement => {
  const { signOut } = useAuth()
  const setIsFromAutoLogout = useSetRecoilState(
    AutoLogoutStore.isFromAutoLogout
  )
  useEffect(() => {
    setIsFromAutoLogout(true)
    settings.delete(['walletName'])
    signOut()
  }, [])
  return <View />
}

export default AutoLogout
