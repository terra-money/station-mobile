//
//  PushNotificationManager.m
//  TerraStation
//
//  Created by Henry on 2021/06/08.
//

#import "PushNotificationManager.h"
@import UIKit;
@import Darwin.sys.sysctl;

@implementation PushNotificationManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(clearNotification:(RCTPromiseResolveBlock) resolve
                  rejecter:(RCTPromiseRejectBlock) __unused reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [[UIApplication sharedApplication] setApplicationIconBadgeNumber:1];
    [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
    [[UIApplication sharedApplication] cancelAllLocalNotifications];
  });
  return resolve(@YES);
}

RCT_EXPORT_METHOD(moveNotificationSettings:(RCTPromiseResolveBlock) resolve
                  rejecter:(RCTPromiseRejectBlock) __unused reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:UIApplicationOpenSettingsURLString] options:@{} completionHandler:nil];
  });
  return resolve(@YES);
}

@end
