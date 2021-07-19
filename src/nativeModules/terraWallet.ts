import { NativeModules } from 'react-native'

export type TerraWalletType = {
  getNewWallet(): Promise<{
    privateKey: 'string'
    publicKey: 'string'
    publicKey64: 'string'
    address: 'string'
    mnemonic: 'string'
  }>
}

const TerraWallet: TerraWalletType = NativeModules.TerraWallet

export default TerraWallet
