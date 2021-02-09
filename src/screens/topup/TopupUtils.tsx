import { LCDClient } from '@terra-money/terra.js'

export const DEBUG_TOPUP = false

export const getLCDClient = (
  chainID: string,
  URL: string
): LCDClient => {
  return new LCDClient({
    chainID,
    URL,
  })
}
