import Foundation

class KeyDerivation {
    typealias KeyIndexPath = (value: UInt32, hardened: Bool)
    
    private let highestBit:UInt32 = 0x80000000
    private var indexes = [KeyIndexPath]()
    private var currentChildNode:HDNode?
    
    static func getKeyPair(seed:Data, path:String, index:Int) -> KeyPair? {
        return KeyDerivation(path: path)?.derivePath(from: seed).key(at: index)
    }
    
    
    init?(path: String) {
        let path = path.replacingOccurrences(of: "/index", with: "")
        
        let components = path.split(separator: "/")
        for component in components {
            if component == "m" {
                continue
            }
            if component.hasSuffix("'") {
                guard let value = Int(component.dropLast()) else { return nil }
                indexes.append(getKeyIndexPath(value: value, hardened: true))
            } else {
                guard let value = Int(component) else { return nil }
                indexes.append(getKeyIndexPath(value: value, hardened: false))
            }
        }
    }
  
    private func getKeyIndexPath(value: Int, hardened: Bool) -> KeyIndexPath {
        let val = hardened ? UInt32(value) | highestBit : UInt32(value)
        return KeyIndexPath(val, hardened)
    }
    
    private func derivePath(from seed:Data) -> KeyDerivation {
        var node = HDNode()
        _ = seed.withUnsafeBytes { dataPtr in
            hdnode_from_seed(dataPtr, Int32(seed.count), "secp256k1", &node)
        }
        
        for index in indexes {
            hdnode_private_ckd(&node, index.value)
        }
        
        self.currentChildNode = node
        return self
    }
    
    private func key(at index:Int) -> KeyPair? {
        guard var node = self.currentChildNode else { return nil }
        hdnode_private_ckd(&node, UInt32(index))
        return KeyPair(node: node)
    }
}
