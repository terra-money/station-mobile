import { Config, InitialConfigState } from '../types'
import createContext from './createContext'
import useLang from './useLang'
import useCurrency from './useCurrency'
import useChain from './useChain'
import useTheme from './useTheme'

export const [useConfig, ConfigProvider] = createContext<Config>()

export const useConfigState = (
  initial: InitialConfigState
): Config => {
  const lang = useLang(initial.lang)
  const chain = useChain(initial.chain)
  const currency = useCurrency(initial.currency)
  const theme = useTheme(initial.theme)
  return { lang, currency, chain, theme }
}

export const useCurrentChainName = (): string => {
  const { chain } = useConfig()
  return chain.current.name
}

export const useIsClassic = (): boolean => {
  const { chain } = useConfig()
  return chain.current.chainID === 'columbus-5'
}
