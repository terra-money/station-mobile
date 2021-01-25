import { NativeModules } from 'react-native'

const { TerraWallet } = NativeModules

export default {
  generateSeed: async (): Promise<string> => {
    const { mnemonic } = await TerraWallet.getNewWallet()
    return mnemonic
  },
}
