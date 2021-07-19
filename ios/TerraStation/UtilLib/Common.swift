//
//  Common.swift
//  TerraStation
//
//  Created by Henry on 2021/06/14.
//

import Foundation

@objc(Common)
class Common: NSObject {
  static func moduleName() -> String! {
    return "Common"
  }
  
  @objc func getAppIdentifier(_ resolver: RCTPromiseResolveBlock, rejecter:RCTPromiseRejectBlock) {
    let key = "uuid"
    
    if let uuid = UserDefaults.standard.value(forKey: key) as? String {
      resolver(uuid)
    } else {
      let value = UUID().uuidString
      UserDefaults.standard.set(value, forKey: key)
      UserDefaults.standard.synchronize()
      resolver(value)
    }
  }
}
