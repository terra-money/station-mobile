import React, { ReactElement, ReactNode } from 'react'
import { useAuth, User } from '@terra-money/use-native-station'
import PleaseSignIn from './PleaseSignIn'

interface Props {
  children: (user: User) => ReactNode
}

const WithAuth = ({ children }: Props): ReactElement => {
  const { user } = useAuth()
  return !user ? <PleaseSignIn /> : <>{children(user)}</>
}

export default WithAuth
