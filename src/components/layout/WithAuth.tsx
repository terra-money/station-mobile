import React, { ReactElement, ReactNode } from 'react'
import { useAuth, User } from 'lib'

interface Props {
  children: (user: User) => ReactNode
}

const WithAuth = ({ children }: Props): ReactElement => {
  const { user } = useAuth()
  return user ? <>{children(user)}</> : <></>
}

export default WithAuth
