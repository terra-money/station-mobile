//
//  TerraWallet.m

//
//  Created by Felix on 2020/04/03.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TerraWallet, NSObject)

+ (BOOL)requiresMainQueueSetup
{
  return false;  // only do this if your module initialization relies on calling UIKit!
}

RCT_EXTERN_METHOD(getNewWallet: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getNewWalletFromSeed:(NSString *)mnemonic
                  bip:(int)bip
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(sign:(NSDictionary *)message
                  sequence:(NSString *)sequence
                  account_number:(NSString *)account_number
                  chain_id:(NSString *)chain_id
                  hexPrivateKey:(NSString *)hexPrivateKey
                  hexPublicKey:(NSString *)hexPublicKey
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isValidAddress:(NSString *)address
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
