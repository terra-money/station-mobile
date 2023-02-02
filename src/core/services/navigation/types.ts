import { RouteProp } from '@react-navigation/native'
import { PlaygroundRoutes } from 'playground/routes'

export type TabNavigatorParamList = {
  Wallet: undefined
  Swap: undefined
  Staking: undefined
  Gov: undefined
  NFT: undefined
  History: undefined
  Contract: undefined
}

export type StackParamList = {
  Tabs: undefined
}

type Keyof<T extends Record<string, unknown>> = Extract<
  keyof T,
  string
>

export type RootRouteProp<
  RouteName extends keyof StackParamList = Keyof<StackParamList>
> = RouteProp<StackParamList, RouteName>

export type RootStackParamList = StackParamList &
  TabNavigatorParamList & {
    PreTesting: undefined
    PostTesting: undefined
  } & PlaygroundRoutes

declare global {
  namespace ReactNavigation {
    type RootParamList = RootStackParamList
  }
}
