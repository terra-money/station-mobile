//
//  Common.m
//  TerraStation
//
//  Created by Henry on 2021/06/14.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Common, NSObject)

+ (BOOL)requiresMainQueueSetup
{
  return false;  // only do this if your module initialization relies on calling UIKit!
}

RCT_EXTERN_METHOD(getAppIdentifier: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getGooglePlayStoreInstalled: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
