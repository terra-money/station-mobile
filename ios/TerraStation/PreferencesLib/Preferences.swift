//
//  Preferences.swift

//
//  Created by Felix on 2020/04/09.
//

import Foundation

@objc(Preferences)
class Preferences: NSObject {
  
  static func moduleName() -> String! {
    return "Preferences";
  }
  
  static func requiresMainQueueSetup() -> Bool {
    //If your module does not require access to UIKit, then you should respond to + requiresMainQueueSetup with NO.
    return false
  }
  
  func writePreference(key:String, value:String) {
    let data = NSData(data: value.data(using: .utf8)!).aes256Encrypt()!
    UserDefaults.standard.set(data, forKey: key)
    UserDefaults.standard.synchronize()
  }
  
  func readPreference(key:String) -> String? {
    guard let value = UserDefaults.standard.value(forKey: key) as? Data else {
      return nil
    }
    let data = NSData(data: value).aes256Decrypt()!
    return String(bytes: data, encoding: .utf8)
  }
  
  @objc func setBool(_ key:String, value:Bool) {
    UserDefaults.standard.set(value, forKey: key)
    UserDefaults.standard.synchronize()
  }
  
  @objc func getBool(_ key:String,
                     resolver: RCTPromiseResolveBlock,
                     rejecter:RCTPromiseRejectBlock) {
    let decryptValue = readPreference(key: key)
    if(decryptValue == nil) {
      guard let value = UserDefaults.standard.value(forKey: key) as? Bool else {
        resolver(false)
        return
      }
      writePreference(key: key, value: value.description)
      resolver(value)
    } else {
      resolver(decryptValue == "true" ? true : false)
    }
  }
  
  @objc func setString(_ key:String, value:String) {
    UserDefaults.standard.set(value, forKey: key)
    UserDefaults.standard.synchronize()
  }
  
  @objc func getString(_ key:String,
                       resolver: RCTPromiseResolveBlock,
                       rejecter:RCTPromiseRejectBlock) {
    let decryptValue = readPreference(key: key)
    if(decryptValue == nil) {
      guard let value = UserDefaults.standard.value(forKey: key) as? String else {
        resolver("")
        return
      }
      writePreference(key: key, value: value)
      resolver(value)
    } else {
      resolver(decryptValue)
    }
  }
  
  @objc func remove(_ key:String) {
    UserDefaults.standard.removeObject(forKey: key)
    UserDefaults.standard.synchronize()
  }
  
  @objc func clear() {
    UserDefaults.standard.removePersistentDomain(forName: Bundle.main.bundleIdentifier!)
    UserDefaults.standard.synchronize()
  }
}
