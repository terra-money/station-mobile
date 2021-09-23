import { ChainOptions } from 'lib'

enum NetworkEnum {
  mainnet = 'mainnet',
  tequila = 'tequila',
  bombay = 'bombay',
}

const network: Record<NetworkEnum, ChainOptions> = {
  mainnet: {
    name: 'mainnet',
    chainID: 'columbus-4',
    lcd: 'https://lcd.terra.dev',
    fcd: 'https://fcd.terra.dev',
  },
  tequila: {
    name: 'testnet',
    chainID: 'tequila-0004',
    lcd: 'https://tequila-lcd.terra.dev',
    fcd: 'https://tequila-fcd.terra.dev',
  },
  bombay: {
    name: 'bombay',
    chainID: 'bombay-11',
    lcd: 'https://bombay-lcd.terra.dev',
    fcd: 'https://bombay-fcd.terra.dev',
  },
}

export const version = {
  production: 'https://terra.money/station-mobile/version_v2.json',
  staging:
    'https://terra.money/station-mobile/version_staging_v2.json',
}

export default network
