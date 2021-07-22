//
//  Keystore.m

//
//  Created by Felix on 2020/04/09.
//

#import "Keystore.h"
#import "../NSData+AES.h"

@implementation Keystore

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
  return false;  // only do this if your module initialization relies on calling UIKit!
}

- (NSMutableDictionary *)newSearchDictionary:(NSString *)identifier {
  NSMutableDictionary *searchDictionary = [[NSMutableDictionary alloc] init];
  [searchDictionary setObject:(id)kSecClassGenericPassword forKey:(id)kSecClass];
  [searchDictionary setObject:[identifier dataUsingEncoding:NSUTF8StringEncoding] forKey:(id)kSecAttrAccount];
  [searchDictionary setObject:@"_secure_storage_service" forKey:(id)kSecAttrService];
  
  return searchDictionary;
}

- (BOOL)writeKeychain: (NSString *)key value:(NSString *)value {
  @try {
    CFStringRef accessible = kSecAttrAccessibleWhenUnlocked;
    NSMutableDictionary *dictionary = [self newSearchDictionary:key];
    
    NSData *valueData = [[value dataUsingEncoding:NSUTF8StringEncoding] AES256Encrypt];
    
    [dictionary setObject:valueData forKey:(id)kSecValueData];
    dictionary[(__bridge NSString *)kSecAttrAccessible] = (__bridge id)accessible;
    
    OSStatus status = SecItemAdd((CFDictionaryRef)dictionary, NULL);
    if (status == errSecSuccess) {
      return TRUE;
    } else {
      NSMutableDictionary *searchDictionary = [self newSearchDictionary:key];
      NSMutableDictionary *updateDictionary = [[NSMutableDictionary alloc] init];
      NSData *passwordData = [[value dataUsingEncoding:NSUTF8StringEncoding] AES256Encrypt];
      [updateDictionary setObject:passwordData forKey:(id)kSecValueData];
      updateDictionary[(__bridge NSString *)kSecAttrAccessible] = (__bridge id)accessible;
      OSStatus status = SecItemUpdate((CFDictionaryRef)searchDictionary,
                                      (CFDictionaryRef)updateDictionary);
      
      if (status == errSecSuccess) {
        return TRUE;
      } else {
        return FALSE;
      }
    }
  }
  @catch (NSException *exception) {
    return FALSE;
  }
}

- (NSString*)readOldKeychain: (NSString*)key {
  @try {
    NSMutableDictionary *searchDictionary = [self newSearchDictionary:key];
    [searchDictionary setObject:(id)kSecMatchLimitOne forKey:(id)kSecMatchLimit];
    [searchDictionary setObject:(id)kCFBooleanTrue forKey:(id)kSecReturnData];
    
    NSDictionary *found = nil;
    CFTypeRef result = NULL;
    OSStatus status = SecItemCopyMatching((CFDictionaryRef)searchDictionary,
                                          (CFTypeRef *)&result);
    
    NSString *value = nil;
    found = (__bridge NSDictionary*)(result);
    if (found) {
      NSData* data = [[[NSData alloc] initWithData:found] AES256Decrypt: @"\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0" ];
      value = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
      if(value == nil) {
        value = [[NSString alloc] initWithData:found encoding:NSUTF8StringEncoding];
        if(value) {
          [self writeKeychain:key value:value];
        }
      }
    }
    return value;
  }
  @catch(NSException *exception) {
  }
  return nil;
}

- (NSString*)readKeychain: (NSString*)key {
  @try {
    NSMutableDictionary *searchDictionary = [self newSearchDictionary:key];
    [searchDictionary setObject:(id)kSecMatchLimitOne forKey:(id)kSecMatchLimit];
    [searchDictionary setObject:(id)kCFBooleanTrue forKey:(id)kSecReturnData];
    
    NSDictionary *found = nil;
    CFTypeRef result = NULL;
    OSStatus status = SecItemCopyMatching((CFDictionaryRef)searchDictionary,
                                          (CFTypeRef *)&result);
    
    NSString *value = nil;
    found = (__bridge NSDictionary*)(result);
    if (found) {
      NSData* data = [[[NSData alloc] initWithData:found] AES256Decrypt];
      value = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
      if(value == nil) {
        value = [[NSString alloc] initWithData:found encoding:NSUTF8StringEncoding];
        if(value) {
          [self writeKeychain:key value:value];
        }
      }
    }
    return value;
  }
  @catch(NSException *exception) {
  }
  return nil;
}

RCT_EXPORT_METHOD(write: (NSString *)key value:(NSString *)value
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    [self writeKeychain:key value:value];
  }
  @catch (NSException *exception) {
    reject(@"9", @"key does not present", nil);
  }
}

RCT_EXPORT_METHOD(read:(NSString *)key
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    NSString* value = [self readKeychain: key];
    resolve(value);
  }
  @catch (NSException *exception) {
    reject(@"1", @"key does not present", nil);
  }
}

RCT_EXPORT_METHOD(remove:(NSString *)key
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    NSMutableDictionary *searchDictionary = [self newSearchDictionary:key];
    OSStatus status = SecItemDelete((CFDictionaryRef)searchDictionary);
    
    if (status == errSecSuccess) {
      //resolve(@"key removed successfully");
    } else {
      //reject(@"6", @"Could not find the key to delete.", nil);
    }
  }
  @catch(NSException *exception) {
    //reject(@"6", @"Could not find the key to delete.", nil);
  }
}

RCT_EXPORT_METHOD(migratePreferences:(NSString *)key
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString* data = nil;
  data = [self readOldKeychain: key];
  if(data != nil) {
    [self writeKeychain:key value:data];
  }
  resolve(nil);
}

@end
