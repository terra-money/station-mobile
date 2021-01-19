import { NativeModules } from 'react-native'
import { Address, Wallet, Bip } from 'use-station/src'

const { TerraWallet } = NativeModules

export default {
  generateAddresses: async (
    phrase: string
  ): Promise<[Address, Address]> => {
    const wallet118 = await TerraWallet.getNewWalletFromSeed(
      phrase,
      118
    )
    const wallet330 = await TerraWallet.getNewWalletFromSeed(
      phrase,
      330
    )
    return [wallet118.address, wallet330.address]
  },

  generateWalletFromSeed: async ([phrase, bip]: [
    string,
    Bip
  ]): Promise<Wallet> => {
    const wallet = await TerraWallet.getNewWalletFromSeed(phrase, bip)

    return {
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
      terraAddress: wallet.address,
    }
  },

  generateSeed: async (): Promise<string> => {
    const { mnemonic } = await TerraWallet.getNewWallet()
    return mnemonic
  },
}
