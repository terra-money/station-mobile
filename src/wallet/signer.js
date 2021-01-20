import { signWithPrivateKey } from './keys'

export default (privateKey, publicKey) => {
  return (signMessage) => {
    const signature = signWithPrivateKey(
      signMessage,
      Buffer.from(privateKey, 'hex')
    )

    return { signature, publicKey: Buffer.from(publicKey, 'hex') }
  }
}
