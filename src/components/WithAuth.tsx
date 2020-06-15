import React, { ReactNode } from 'react'
import { useAuth, User } from '@terra-money/use-native-station'
import PleaseSignIn from './PleaseSignIn'

interface Props {
  card?: boolean
  children: (user: User) => ReactNode
}

const WithAuth = ({ card, children }: Props) => {
  const { user } = useAuth()
  return !user ? <PleaseSignIn card={card} /> : <>{children(user)}</>
}

export default WithAuth
