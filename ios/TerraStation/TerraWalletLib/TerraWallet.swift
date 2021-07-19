import Foundation

@objc(TerraWallet)
class TerraWallet: NSObject {
    static func moduleName() -> String! {
        return "TerraWallet";
    }

    static func requiresMainQueueSetup() -> Bool {
        //If your module does not require access to UIKit, then you should respond to + requiresMainQueueSetup with NO.
        return false
    }

    //generate
    @objc func getNewWallet(_ resolver: RCTPromiseResolveBlock, rejecter:RCTPromiseRejectBlock) {
        let wallet = TerraWalletSDK.getNewWallet()
        resolver(wallet as NSDictionary)
    }

    //generate from seed
    @objc public func getNewWalletFromSeed(_ mnemonic:String, bip:Int, resolver: RCTPromiseResolveBlock, rejecter:RCTPromiseRejectBlock) {
        let wallet = TerraWalletSDK.getNewWalletFromSeed(mnemonic, bip: bip)
        resolver(wallet as NSDictionary)
    }

    @objc func sign(_ message:Dictionary<String, Any>,
                    sequence:String,
                    account_number:String,
                    chain_id:String,
                    hexPrivateKey:String,
                    hexPublicKey:String,
                    resolver: RCTPromiseResolveBlock,
                    rejecter:RCTPromiseRejectBlock) {

      let body = TerraWalletSDK.sign(message, sequence: sequence, account_number: account_number, chain_id: chain_id, hexPrivateKey: hexPrivateKey, hexPublicKey: hexPublicKey)

      resolver(body as NSDictionary)
    }

    @objc func isValidAddress(_ address:String,
                              resolver: RCTPromiseResolveBlock,
                              rejecter:RCTPromiseRejectBlock) {
        let result = TerraWalletSDK.isValidAddress(address);
        resolver(result);
    }
}
