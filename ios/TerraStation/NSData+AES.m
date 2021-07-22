//
//  NSData+AES.m
//  TerraStation
//
//  Created by Henry on 2021/06/15.
//
#import "NSData+AES.h"
#import <CommonCrypto/CommonCryptor.h>
#import "Keystore.h"

NSString* kPrefKey = NULL;

@implementation NSData (AES)

- (NSMutableDictionary *)newSearchDictionary:(NSString *)identifier {
  NSMutableDictionary *searchDictionary = [[NSMutableDictionary alloc] init];
  [searchDictionary setObject:(id)kSecClassGenericPassword forKey:(id)kSecClass];
  [searchDictionary setObject:[identifier dataUsingEncoding:NSUTF8StringEncoding] forKey:(id)kSecAttrAccount];
  [searchDictionary setObject:@"_secure_storage_service" forKey:(id)kSecAttrService];
  
  return searchDictionary;
}

NSString* const key = @"key";
- (void) initPrefKey {
  @try {
    NSMutableDictionary *searchDictionary = [self newSearchDictionary:key];
    [searchDictionary setObject:(id)kSecMatchLimitOne forKey:(id)kSecMatchLimit];
    [searchDictionary setObject:(id)kCFBooleanTrue forKey:(id)kSecReturnData];
    
    NSDictionary *found = nil;
    CFTypeRef result = NULL;
    OSStatus status = SecItemCopyMatching((CFDictionaryRef)searchDictionary,
                                          (CFTypeRef *)&result);
    
    found = (__bridge NSDictionary*)(result);
    if (found) {
      NSData* data = [[NSData alloc] initWithData:found];
      kPrefKey = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    }
  }
  @catch(NSException *exception) {}
  
  if(kPrefKey != nil) {
    return;
  }
  
  uint8_t buffer[24];
  (void)SecRandomCopyBytes(kSecRandomDefault, 24, buffer);
  NSData* bufferData = [[NSData alloc] initWithBytes:buffer length:sizeof(buffer)];
  
  const uint8_t* input = (const uint8_t*)[bufferData bytes];
  NSInteger length = [bufferData length];
  
  static char table[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  NSMutableData* data = [NSMutableData dataWithLength:((length + 2) / 3) * 4];
  uint8_t* output = (uint8_t*)data.mutableBytes;
  for (NSInteger i=0; i < length; i += 3) {
      NSInteger value = 0;
      for (NSInteger j = i; j < (i + 3); j++) {
          value <<= 8;

          if (j < length) {
              value |= (0xFF & input[j]);
          }
      }

      NSInteger theIndex = (i / 3) * 4;
      output[theIndex + 0] =                    table[(value >> 18) & 0x3F];
      output[theIndex + 1] =                    table[(value >> 12) & 0x3F];
      output[theIndex + 2] = (i + 1) < length ? table[(value >> 6)  & 0x3F] : '=';
      output[theIndex + 3] = (i + 2) < length ? table[(value >> 0)  & 0x3F] : '=';
  }

  kPrefKey = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];

  @try {
    CFStringRef accessible = kSecAttrAccessibleWhenUnlocked;
    NSMutableDictionary *dictionary = [self newSearchDictionary:key];
    
    NSData *valueData = [kPrefKey dataUsingEncoding:NSUTF8StringEncoding];
    
    [dictionary setObject:valueData forKey:(id)kSecValueData];
    dictionary[(__bridge NSString *)kSecAttrAccessible] = (__bridge id)accessible;
    
    OSStatus status = SecItemAdd((CFDictionaryRef)dictionary, NULL);
    if (status == errSecSuccess) {
      return;
    } else {
      NSMutableDictionary *searchDictionary = [self newSearchDictionary:key];
      NSMutableDictionary *updateDictionary = [[NSMutableDictionary alloc] init];
      
      [updateDictionary setObject:valueData forKey:(id)kSecValueData];
      updateDictionary[(__bridge NSString *)kSecAttrAccessible] = (__bridge id)accessible;
      OSStatus status = SecItemUpdate((CFDictionaryRef)searchDictionary,
                                      (CFDictionaryRef)updateDictionary);
    }
  }
  @catch (NSException *exception) { }
  
}

- (NSData*) AES256Encrypt {
  if(kPrefKey == nil) {
    [self initPrefKey];
  }
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
  if(kPrefKey == NULL) {
    [self initPrefKey];
  }
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
