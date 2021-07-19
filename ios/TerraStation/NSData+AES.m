//
//  NSData+AES.m
//  TerraStation
//
//  Created by Henry on 2021/06/15.
//
#import "NSData+AES.h"
#import <CommonCrypto/CommonCryptor.h>

NSString* const kPrefKey = @"VGhpcyBpcyB0aGUga2V5IGZvciBhIHNlY3VyZSBzdG9yYWdlIEFFUyBLZXkK";

@implementation NSData (AES)

- (NSData*) AES256Encrypt {
  return [self iAESEncrypt:kPrefKey keySize:kCCKeySizeAES256];
}

- (NSData*) AES256Encrypt:(NSString *)key {
  return [self iAESEncrypt:key keySize:kCCKeySizeAES256];
}

- (NSData*) iAESEncrypt:(NSString *)key keySize:(int)keySize {
  if(key == nil)
    return nil;
  
  char keyPtr[keySize+1];
  bzero( keyPtr, sizeof(keyPtr) );
  
  [key getCString: keyPtr maxLength: sizeof(keyPtr) encoding:NSUTF8StringEncoding];
  size_t numBytesEncrypted = 0x00;
  
  NSUInteger dataLength = [self length];
  size_t     bufferSize = dataLength + kCCBlockSizeAES128;
  void      *buffer     = malloc(bufferSize);
  // const unsigned char iv[] = {0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00};
  
  CCCryptorStatus result = CCCrypt( kCCEncrypt,
                                   kCCAlgorithmAES128,
                                   kCCOptionPKCS7Padding,
                                   keyPtr,
                                   keySize,
                                   NULL /*iv*/,
                                   [self bytes], [self length],
                                   buffer, bufferSize,
                                   &numBytesEncrypted );
  
  if( result == kCCSuccess )
    return [NSData dataWithBytesNoCopy:buffer length:numBytesEncrypted];
  else
    NSLog(@"iAESEncrypt FAIL!");
  
  free(buffer);
  return nil;
}

- (NSData *) AES256Decrypt {
  return [self iAESDecrypt:kPrefKey keySize:kCCKeySizeAES256];
}

- (NSData *) AES256Decrypt:(NSString *)key {
  return [self iAESDecrypt:key keySize:kCCKeySizeAES256];
}

- (NSData *) iAESDecrypt:(NSString *)key keySize:(int)keySize {
  if(key == nil)
    return nil;
  
  char  keyPtr[keySize + 0x01];
  bzero( keyPtr, sizeof(keyPtr) );
  
  // fetch key data
  [key getCString: keyPtr maxLength: sizeof(keyPtr) encoding: NSUTF8StringEncoding];
  
  NSUInteger dataLength     = [self length];
  size_t     bufferSize     = dataLength + kCCBlockSizeAES128;
  void      *buffer_decrypt = malloc(bufferSize);
  // const unsigned char iv[] = {0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00};
  
  size_t numBytesDecrypted    = 0x00;
  CCCryptorStatus result = CCCrypt( kCCDecrypt,
                                   kCCAlgorithmAES128,
                                   kCCOptionPKCS7Padding,
                                   keyPtr,
                                   keySize,
                                   NULL /*iv*/,
                                   [self bytes], [self length],
                                   buffer_decrypt, bufferSize,
                                   &numBytesDecrypted );
  
  if( result == kCCSuccess )
    return [NSData dataWithBytesNoCopy:buffer_decrypt length:numBytesDecrypted];
  else
    NSLog(@"iAESDecrypt FAIL!");
  
  return nil;
}

@end
