//
//  TerraWalletSDK.swift
//  TerraWalletSDK
//
//  Created by Felix on 04/07/2020.
//  Copyright (c) 2020 TerraFormLabs. All rights reserved.
//

import Foundation

@objc public class TerraWalletSDK : NSObject {
    
    @objc static public let PRIVATE_KEY = "privateKey"
    @objc static public let PUBLIC_KEY = "publicKey"
    @objc static public let PUBLIC_KEY_UNCOMPRESSED = "publicKey64"
    @objc static public let ADDRESS = "address"
    @objc static public let MNEMONIC = "mnemonic"
    
    //generate
    @objc static public func getNewWallet() -> Dictionary<String, String> {
        //tuple로 리턴을 하면 objc환경에서 사용할 수 없다.
        let wallet = Utils.generate()
        
        var result = Dictionary<String, String>()
        result[PRIVATE_KEY] = wallet.hexPrivateKey
        result[PUBLIC_KEY] = wallet.hexPublicKey
        result[PUBLIC_KEY_UNCOMPRESSED] = wallet.hexPublicKey64
        result[ADDRESS] = wallet.terraAddress
        result[MNEMONIC] = wallet.mnemonic
        
        return result
    }
    
    //generate from seed
    @objc static public func getNewWalletFromSeed(_ mnemonic:String, bip:Int) -> Dictionary<String, String> {
        //tuple로 리턴을 하면 objc환경에서 사용할 수 없다.
        let wallet = Utils.generate(mnemonic: mnemonic, bip: bip)
        
        var result = Dictionary<String, String>()
        result[PRIVATE_KEY] = wallet.hexPrivateKey
        result[PUBLIC_KEY] = wallet.hexPublicKey
        result[PUBLIC_KEY_UNCOMPRESSED] = wallet.hexPublicKey64
        result[ADDRESS] = wallet.terraAddress
        
        return result
    }
  
    //sign
    @objc static public func sign(_ message:Dictionary<String, Any>,
                      sequence:String,
                      account_number:String,
                      chain_id:String,
                      hexPrivateKey:String,
                      hexPublicKey:String) -> Dictionary<String, Any> {
    
        let body = Sign(hexPrivateKey: hexPrivateKey,
                        hexPublicKey: hexPublicKey,
                        sequence: sequence,
                        accountNumber: account_number,
                        chainId: chain_id).sign(message: message)
      
        return body
    }
  
    @objc static public func isValidAddress(_ address:String) -> Bool {
        return Utils.isValidAddress(address: address)
    }
}
