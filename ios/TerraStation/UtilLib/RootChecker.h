//
//  RootCheck.h
//  RootCheckTest
//
//  Created by Henry on 2020/12/14.
//

#ifndef RootChecker_h
#define RootChecker_h

#if __has_include(<React/RCTBridgeModule.h>)
  #import <React/RCTBridgeModule.h>
#elif __has_include("React/RCTBridgeModule.h")
  #import "React/RCTBridgeModule.h"
#else
  #import "RCTBridgeModule.h"
#endif

@interface RootChecker : NSObject <RCTBridgeModule>

@end

#endif /* RootChecker_h */
