import React, { ReactElement } from 'react'
import { useAuth } from 'use-station/src'

import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'

const Navigator = (): ReactElement => {
  const { user } = useAuth()
  return user ? <MainNavigator /> : <AuthNavigator />
}
export default Navigator
