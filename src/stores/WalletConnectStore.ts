import WalletConnect from '@walletconnect/client'
import { atom, selectorFamily } from 'recoil'

const walletConnectors = atom<
  Record<
    string, // handshakeTopic
    WalletConnect
  >
>({
  key: 'walletConnectors',
  default: {},
  dangerouslyAllowMutability: true,
})

const walletConnectRecoverComplete = atom<boolean>({
  key: 'walletConnectRecoverComplete',
  default: false,
})

const getWalletConnector = selectorFamily<
  WalletConnect,
  { handshakeTopic: string }
>({
  key: 'getWalletConnector',
  get: ({ handshakeTopic }) => {
    return ({ get }): WalletConnect => {
      const connectors = get(walletConnectors)
      return connectors[handshakeTopic]
    }
  },
})

const isListenConfirmRemove = atom<boolean>({
  key: 'walletConnect_isListenConfirmRemove',
  default: false,
})

export default {
  walletConnectors,
  walletConnectRecoverComplete,
  getWalletConnector,
  isListenConfirmRemove,
}
