//
//  PushNotificationManager.h
//  TerraStation
//
//  Created by Henry on 2021/06/08.
//

#ifndef PushNotificationManager_h
#define PushNotificationManager_h

#if __has_include(<React/RCTBridgeModule.h>)
  #import <React/RCTBridgeModule.h>
#elif __has_include("React/RCTBridgeModule.h")
  #import "React/RCTBridgeModule.h"
#else
  #import "RCTBridgeModule.h"
#endif

@interface PushNotificationManager : NSObject <RCTBridgeModule>

@end

#endif /* PushNotificationManager_h */
