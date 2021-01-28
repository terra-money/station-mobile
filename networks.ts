import { ChainOptions } from 'use-station/src'

enum NetworkEnum {
  mainnet = 'mainnet',
  tequila = 'tequila',
}

const network: Record<NetworkEnum, ChainOptions> = {
  mainnet: {
    name: 'Columbus-4',
    chainID: 'columbus-4',
    lcd: 'https://lcd.terra.dev',
    fcd: 'https://fcd.terra.dev',
    ws: 'wss://fcd.terra.dev',
  },
  tequila: {
    name: 'Tequila-0004',
    chainID: 'tequila-0004',
    lcd: 'https://tequila-lcd.terra.dev',
    fcd: 'https://tequila-fcd.terra.dev',
    ws: 'wss://tequila-fcd.terra.dev',
  },
}

export default network
