import { createContext, useContext } from 'react'

export default <A>(): readonly [
  () => A,
  React.Provider<A | undefined>
] => {
  const ctx = createContext<A | undefined>(undefined)

  const useCtx = (): A => {
    const c = useContext(ctx)
    if (!c)
      throw new Error('This must be inside a Provider with a value')
    return c
  }

  return [useCtx, ctx.Provider] as const
}
