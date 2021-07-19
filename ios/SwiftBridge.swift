//
//  SwiftBridge.swift
//  TerraStation
//
//  Created by henry on 2021/06/20.
//
import Foundation
import IOSSecuritySuite

@objc class SwiftBridge: NSObject {
  @objc static func amIJailbroken() -> Bool {
    return IOSSecuritySuite.amIJailbroken()
  }
  @objc static func amIDebugged() -> Bool {
    return IOSSecuritySuite.amIDebugged()
  }
  @objc static func amIReverseEngineered() -> Bool {
    return IOSSecuritySuite.amIReverseEngineered()
  }
}
