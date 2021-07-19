//
//  NSData+AES.h
//  TerraStation
//
//  Created by Henry on 2021/06/15.
//
#ifndef NSData_AES_h
#define NSData_AES_h

#import <Foundation/Foundation.h>

@interface NSData (AES)

- (NSData *) AES256Encrypt;
- (NSData *) AES256Encrypt: (NSString *) key;
- (NSData *) AES256Decrypt;
- (NSData *) AES256Decrypt: (NSString *) key;

@end

#endif /* NSData_AES_h */
