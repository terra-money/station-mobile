import { ChainOptions } from 'use-station/src'

enum NetworkEnum {
  mainnet = 'mainnet',
  tequila = 'tequila',
}

const network: Record<NetworkEnum, ChainOptions> = {
  mainnet: {
    name: 'mainnet', // Don't change. It's related with SHUTTLES valiable in use-station/useSend.
    chainID: 'columbus-4',
    lcd: 'https://lcd.terra.dev',
    fcd: 'https://fcd.terra.dev',
    ws: 'wss://fcd.terra.dev',
  },
  tequila: {
    name: 'testnet', // Don't change. It's related with SHUTTLES valiable in use-station/useSend.
    chainID: 'tequila-0004',
    lcd: 'https://tequila-lcd.terra.dev',
    fcd: 'https://tequila-fcd.terra.dev',
    ws: 'wss://tequila-fcd.terra.dev',
  },
}

export const isDev = true
export const version = {
  production: 'https://terra.money/station-mobile/version.json',
  staging: 'https://terra.money/station-mobile/version_staging.json',
}

export default network
