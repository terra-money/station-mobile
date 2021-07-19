//
//  TamperChecker.h
//  TerraStation
//
//  Created by Henry on 2021/06/21.
//

#ifndef TamperChecker_h
#define TamperChecker_h

#if __has_include(<React/RCTBridgeModule.h>)
  #import <React/RCTBridgeModule.h>
#elif __has_include("React/RCTBridgeModule.h")
  #import "React/RCTBridgeModule.h"
#else
  #import "RCTBridgeModule.h"
#endif

@interface TamperChecker : NSObject <RCTBridgeModule>

@end

#endif /* TamperChecker_h */
