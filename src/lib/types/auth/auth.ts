export interface User {
  address: string
  name: string
}

export interface Auth {
  user?: User
  signIn: (user: User) => void
  signOut: () => void
}
