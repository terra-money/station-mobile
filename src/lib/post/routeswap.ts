import { Coin } from '@terra-money/terra.js'
import axios from 'axios'
import { Dictionary } from 'ramda'
import { ChainOptions, Pairs } from '../types'
import { is } from '../utils'
import { toBase64, toTokenInfo, ToTokenInfoType } from './terraswap'

const RouteContracts: Dictionary<string> = {
  mainnet: 'terra19qx5xe6q9ll4w0890ux7lv2p4mf3csd4qvt3ex',
  testnet: 'terra1dtzpdj3lc7prd46tuxj2aqy40uv4v4xsphwcpx',
}

interface SwapParams {
  from: string
  to: string
}

interface SimulateParams extends SwapParams {
  amount: string
  minimum_receive?: string
  chain: ChainOptions
}

type SwapOperationsType = {
  offer_amount: string
  operations: (
    | {
        native_swap: {
          offer_denom: string
          ask_denom: string
        }
        terra_swap?: undefined
      }
    | {
        terra_swap: {
          offer_asset_info: ToTokenInfoType
          ask_asset_info: ToTokenInfoType
        }
        native_swap?: undefined
      }
  )[]
  minimum_receive: string | undefined
}

type ExecuteType =
  | {
      contract: string
      msg: {
        execute_swap_operations: SwapOperationsType
      }
      coins: Coin[]
    }
  | {
      contract: string
      msg: {
        send: {
          contract: string
          msg: string
          amount: string
        }
      }
      coins?: undefined
    }

export const isMarketAvailable = ({
  from,
  to,
}: SwapParams): boolean => is.nativeDenom(from) && is.nativeDenom(to)

export const findPair = (
  { from, to }: SwapParams,
  pairs?: Pairs
): string | undefined => {
  if (!pairs) return

  const shouldBurnLuna = from === 'uluna' && is.nativeTerra(from)
  const pair = Object.entries(pairs).find(([, tokens]) =>
    [from, to].every((token) => tokens.includes(token))
  )?.[0]

  return shouldBurnLuna ? undefined : pair
}

export const createSwap = ({
  from,
  to,
}: SwapParams):
  | {
      native_swap: {
        offer_denom: string
        ask_denom: string
      }
      terra_swap?: undefined
    }
  | {
      terra_swap: {
        offer_asset_info: ToTokenInfoType
        ask_asset_info: ToTokenInfoType
      }
      native_swap?: undefined
    } =>
  isMarketAvailable({ from, to })
    ? { native_swap: { offer_denom: from, ask_denom: to } }
    : {
        terra_swap: {
          offer_asset_info: toTokenInfo(from),
          ask_asset_info: toTokenInfo(to),
        },
      }

export const findRoute = ({
  from,
  to,
}: SwapParams): (
  | {
      native_swap: {
        offer_denom: string
        ask_denom: string
      }
      terra_swap?: undefined
    }
  | {
      terra_swap: {
        offer_asset_info: ToTokenInfoType
        ask_asset_info: ToTokenInfoType
      }
      native_swap?: undefined
    }
)[] => [
  createSwap({ from, to: 'uusd' }),
  createSwap({ from: 'uusd', to }),
]

export const isRouteAvailable = ({
  from,
  to,
  chain,
  pairs,
}: {
  from: string
  to: string
  chain: string
  pairs?: Pairs
}): boolean | '' | undefined => {
  const r0 =
    isMarketAvailable({ from, to: 'uusd' }) ||
    findPair({ from, to: 'uusd' }, pairs)

  const r1 =
    isMarketAvailable({ from: 'uusd', to }) ||
    findPair({ from: 'uusd', to }, pairs)

  const routeContract = !!RouteContracts[chain]

  return r0 && r1 && routeContract
}

export const getRouteMessage = (
  params: SimulateParams
): {
  simulate: {
    path: string
    msg: {
      simulate_swap_operations: SwapOperationsType
    }
  }
  execute: ExecuteType
} => {
  const { amount, from, to, chain, minimum_receive } = params
  const offer_amount = amount
  const path = RouteContracts[chain.name]
  const operations = findRoute({ from, to })

  const swapOperations: SwapOperationsType = {
    offer_amount,
    operations,
    minimum_receive,
  }
  const msgSimulate = { simulate_swap_operations: swapOperations }
  const msgExecute = { execute_swap_operations: swapOperations }
  const execute: ExecuteType = is.nativeDenom(from)
    ? {
        contract: path,
        msg: msgExecute,
        coins: [new Coin(from, offer_amount)],
      }
    : {
        contract: from,
        msg: {
          send: { contract: path, msg: toBase64(msgExecute), amount },
        },
      }

  return { simulate: { path, msg: msgSimulate }, execute }
}

export const simulateRoute = async (
  params: SimulateParams
): Promise<string> => {
  const { chain } = params
  const { simulate } = getRouteMessage(params)
  const path = `/wasm/contracts/${simulate.path}/store`
  const config = {
    baseURL: chain.lcd,
    params: { query_msg: simulate.msg },
  }
  const { data } = await axios.get<{ result: { amount: string } }>(
    path,
    config
  )
  return data.result.amount
}

export default findRoute
