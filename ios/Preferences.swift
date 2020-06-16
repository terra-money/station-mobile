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

    @objc func setBool(_ key:String, value:Bool) {
      UserDefaults.standard.set(value, forKey: key)
      UserDefaults.standard.synchronize()
    }

    @objc func getBool(_ key:String,
                       resolver: RCTPromiseResolveBlock,
                       rejecter:RCTPromiseRejectBlock) {
      guard let value = UserDefaults.standard.value(forKey: key) as? Bool else {
        resolver(false)
        return
      }

      resolver(value)
    }

  @objc func setDouble(_ key:String, value:Double) {
    UserDefaults.standard.set(value, forKey: key)
    UserDefaults.standard.synchronize()
  }

  @objc func getDouble(_ key:String,
                     resolver: RCTPromiseResolveBlock,
                     rejecter:RCTPromiseRejectBlock) {
    guard let value = UserDefaults.standard.value(forKey: key) as? Double else {
      resolver(0.0)
      return
    }

    resolver(value)
  }

  @objc func setInt(_ key:String, value:Int) {
    UserDefaults.standard.set(value, forKey: key)
    UserDefaults.standard.synchronize()
  }

  @objc func getInt(_ key:String,
                     resolver: RCTPromiseResolveBlock,
                     rejecter:RCTPromiseRejectBlock) {
    guard let value = UserDefaults.standard.value(forKey: key) as? Int else {
      resolver(0)
      return
    }

    resolver(value)
  }

  @objc func setString(_ key:String, value:String) {
    UserDefaults.standard.set(value, forKey: key)
    UserDefaults.standard.synchronize()
  }

  @objc func getString(_ key:String,
                     resolver: RCTPromiseResolveBlock,
                     rejecter:RCTPromiseRejectBlock) {
    guard let value = UserDefaults.standard.value(forKey: key) as? String else {
      resolver("")
      return
    }

    resolver(value)
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
