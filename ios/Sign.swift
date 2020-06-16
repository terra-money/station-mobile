import Foundation

class Sign {

    private var privateKey:Data
    private var publicKey:Data
    private var sequence:String
    private var accountNumber:String
    private var chainId:String

    init(hexPrivateKey:String, hexPublicKey:String, sequence:String, accountNumber:String, chainId:String) {

        self.privateKey = hexPrivateKey.hexToData
        self.publicKey = hexPublicKey.hexToData
        self.sequence = sequence
        self.accountNumber = accountNumber
        self.chainId = chainId
    }

    func sign(message:Dictionary<String, Any>) -> Dictionary<String, Any> {
      let signMessage = createSignMessage(json: message)
      //sort json by key.
      guard let sortedString = jsonSort(signMessage: signMessage) else {
          return [:]
      }

      print("signed : \(sortedString)")

      let signedMessage = signWithPrivateKey(message: sortedString)
      let signatureJson = createSignature(signature: signedMessage)
      let signedTx = createSignedTx(json: message, signature: signatureJson)
      let broadcastBody = createBroadcastBody(json: signedTx, returnType: "block")

      return broadcastBody
    }

    private func createSignMessage(json:Dictionary<String, Any>) -> Dictionary<String, Any> {

        let json_fee = json["fee"] as? Dictionary<String, Any>
        var fee = Dictionary<String, Any>()
        fee["amount"] = json_fee?["amount"] ?? []
        fee["gas"] = json_fee?["gas"]

        var message = Dictionary<String, Any>()
        message["fee"] = fee
        message["memo"] = json["memo"] ?? ""
        message["msgs"] = json["msg"]
        message["sequence"] = self.sequence
        message["account_number"] = self.accountNumber
        message["chain_id"] = self.chainId

        return message
    }

    private func jsonSort(signMessage:Dictionary<String, Any>) -> String? {
      guard let sorted = try? JSONSerialization.data(withJSONObject: signMessage, options: .sortedKeys),
        let sortedString = String(data: sorted, encoding: .utf8)?.replacingOccurrences(of: "\\/", with: "/") else {
          return nil
      }

      return sortedString
    }

    private func signWithPrivateKey(message:String) -> Data {
        guard let jsonData = message.data(using: .utf8) else { return Data() }
        let hashedMessage = Utils.sha256(data: jsonData)

        var curve = secp256k1
        var signature = Data(repeating: 0, count: 64)
        signature.withUnsafeMutableBytes { (sig) in
          ecdsa_sign_digest(&curve, self.privateKey.bytes, hashedMessage.bytes, sig, nil, nil)
        }

        return signature
    }

    private func createSignature(signature:Data) -> Dictionary<String, Any> {

        var dic = Dictionary<String, Any>()
        dic["signature"] = signature.base64EncodedString()
        dic["account_number"] = self.accountNumber
        dic["sequence"] = self.sequence
        dic["pub_key"] = ["type":"tendermint/PubKeySecp256k1",
                          "value":self.publicKey.base64EncodedString()]
        return dic
    }

    private func createSignedTx(json:Dictionary<String, Any>, signature:Dictionary<String, Any>) -> Dictionary<String, Any> {

        var data = json
        data["signatures"] = [signature]
        return data
    }

    private func createBroadcastBody(json:Dictionary<String, Any>, returnType:String) -> Dictionary<String, Any> {

        var data = Dictionary<String, Any>()
        data["tx"] = json
        data["mode"] = returnType
        return data
    }


}
