import { useMemo } from 'react'

import useTerraAssets from 'lib/hooks/useTerraAssets'
import { ChainOptions } from 'lib'
import { NetworkEnum } from 'types'

const defaultNetworks: Record<NetworkEnum, ChainOptions> = {
  mainnet: {
    name: NetworkEnum.mainnet,
    chainID: 'columbus-4',
    lcd: 'https://lcd.terra.dev',
    fcd: 'https://fcd.terra.dev',
    walletconnectID: 1,
  },
  testnet: {
    name: NetworkEnum.testnet,
    chainID: 'tequila-0004',
    lcd: 'https://tequila-lcd.terra.dev',
    fcd: 'https://tequila-fcd.terra.dev',
    walletconnectID: 0,
  },
  bombay: {
    name: NetworkEnum.bombay,
    chainID: 'bombay-11',
    lcd: 'https://bombay-lcd.terra.dev',
    fcd: 'https://bombay-fcd.terra.dev',
    walletconnectID: 2,
  },
}

const useNetworks = (): {
  networks: Record<NetworkEnum, ChainOptions>
} => {
  const { data } = useTerraAssets<Record<NetworkEnum, ChainOptions>>(
    'chains.json'
  )

  const networks: Record<NetworkEnum, ChainOptions> = useMemo(() => {
    const getOptions = (net: NetworkEnum): ChainOptions => {
      return { ...defaultNetworks[net], ...data?.[net] }
    }

    return {
      [NetworkEnum.mainnet]: getOptions(NetworkEnum.mainnet),
      [NetworkEnum.testnet]: getOptions(NetworkEnum.testnet),
      [NetworkEnum.bombay]: getOptions(NetworkEnum.bombay),
    }
  }, [data])

  return {
    networks,
  }
}

export default useNetworks
