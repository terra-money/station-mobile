//
//  Preferences.m

//
//  Created by Felix on 2020/04/09.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Preferences, NSObject)

+ (BOOL)requiresMainQueueSetup
{
  return false;  // only do this if your module initialization relies on calling UIKit!
}

RCT_EXTERN_METHOD(setBool:(NSString *)key
                  value:(BOOL)value)

RCT_EXTERN_METHOD(getBool:(NSString *)key
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setDouble:(NSString *)key
                  value:(double)value)

RCT_EXTERN_METHOD(getDouble:(NSString *)key
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setInt:(NSString *)key
                  value:(int)value)

RCT_EXTERN_METHOD(getInt:(NSString *)key
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setString:(NSString *)key
                  value:(NSString *)value)

RCT_EXTERN_METHOD(getString:(NSString *)key
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(remove:(NSString *)key)

RCT_EXTERN_METHOD(clear)

@end
