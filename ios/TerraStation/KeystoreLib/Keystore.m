//
//  Keystore.m

//
//  Created by Felix on 2020/04/09.
//

#import "Keystore.h"

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

RCT_EXPORT_METHOD(write: (NSString *)key value:(NSString *)value
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {

        CFStringRef accessible = kSecAttrAccessibleWhenUnlocked;
        NSMutableDictionary *dictionary = [self newSearchDictionary:key];

        NSData *valueData = [value dataUsingEncoding:NSUTF8StringEncoding];
        [dictionary setObject:valueData forKey:(id)kSecValueData];
        dictionary[(__bridge NSString *)kSecAttrAccessible] = (__bridge id)accessible;

        OSStatus status = SecItemAdd((CFDictionaryRef)dictionary, NULL);
        if (status == errSecSuccess) {
            resolve(@"Key stored successfully");
        } else {
            NSMutableDictionary *searchDictionary = [self newSearchDictionary:key];
            NSMutableDictionary *updateDictionary = [[NSMutableDictionary alloc] init];
            NSData *passwordData = [value dataUsingEncoding:NSUTF8StringEncoding];
            [updateDictionary setObject:passwordData forKey:(id)kSecValueData];
            updateDictionary[(__bridge NSString *)kSecAttrAccessible] = (__bridge id)accessible;
            OSStatus status = SecItemUpdate((CFDictionaryRef)searchDictionary,
                                            (CFDictionaryRef)updateDictionary);

            if (status == errSecSuccess) {
                resolve(@"Key updated successfully");
            } else {
                reject(@"9", @"key does not present", nil);
            }
        }
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
            value = [[NSString alloc] initWithData:found encoding:NSUTF8StringEncoding];
        }

        if (value == nil) {
            reject(@"1", @"key does not present", nil);
        } else {
            resolve(value);
        }
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
//            resolve(@"key removed successfully");
        } else {
//            reject(@"6", @"Could not find the key to delete.", nil);
        }
    }
    @catch(NSException *exception) {
//        reject(@"6", @"Could not find the key to delete.", nil);
    }
}

@end
