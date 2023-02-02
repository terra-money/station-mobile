import { LocalWallet } from '../types'

type ReturnType = {
  loaded: boolean
  wallet?: LocalWallet
}
export const useLocalWallet = (): ReturnType => {
  // TODO: Fetch locally stored wallet.
  return { loaded: true, wallet: undefined }
}
