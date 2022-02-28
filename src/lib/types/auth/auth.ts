export interface User {
  address: string
  name: string
  ledger?: boolean
  path: number
}

export interface Auth {
  user?: User
  signIn: (user: User) => void
  signOut: () => void
}
