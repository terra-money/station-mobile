//
//  TamperChecker.m
//  TerraStation
//
//  Created by Henry on 2021/06/21.
//

#import <Foundation/Foundation.h>
#import "TamperChecker.h"
#import "TerraStation-Swift.h"

@implementation TamperChecker

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return false;  // only do this if your module initialization relies on calling UIKit!
}

RCT_EXPORT_METHOD(debugCheck:(RCTPromiseResolveBlock) resolve
                  rejecter:(RCTPromiseRejectBlock) __unused reject) {
  BOOL check = [SwiftBridge amIDebugged];
  return resolve(check ? @YES : @NO);
}

@end
