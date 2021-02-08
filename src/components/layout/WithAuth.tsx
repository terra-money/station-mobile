import React, { ReactElement, ReactNode } from 'react'
import { useAuth, User } from 'use-station/src'

interface Props {
  children: (user: User) => ReactNode
}

const WithAuth = ({ children }: Props): ReactElement => {
  const { user } = useAuth()
  return user ? <>{children(user)}</> : <></>
}

export default WithAuth
