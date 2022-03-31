import { useRecoilState, useSetRecoilState } from 'recoil'
import {
  IWalletConnectOptions,
  IPushServerOptions, IWalletConnectSession
} from "@walletconnect/types";
import WalletConnect from '@walletconnect/client'
import _ from 'lodash'

import WalletConnectStore from 'stores/WalletConnectStore'

const useWalletConnect = (): {
  newWalletConnect: (
    connectorOpts: IWalletConnectOptions,
    pushServerOpts?: IPushServerOptions
  ) => WalletConnect
  recoverWalletConnect: (data: any) => void
  saveWalletConnector: (connector: WalletConnect) => void
  removeWalletConnect: (handshakeTopic: string) => void
  disconnectWalletConnect: (handshakeTopic: string) => void
  disconnectAllWalletConnect: () => void
} => {
  const [walletConnectors, setWalletConnectors] = useRecoilState(
    WalletConnectStore.walletConnectors
  )
  const setWalletConnectRecoverComplete = useSetRecoilState(
    WalletConnectStore.walletConnectRecoverComplete
  )

  const newWalletConnect = (
    connectorOpts: IWalletConnectOptions,
    pushServerOpts?: IPushServerOptions
  ): WalletConnect => {
    return new WalletConnect(
      {
        ...connectorOpts,
        clientMeta: {
          description: 'Terra mobile station',
          url: 'https://terra.money/',
          icons: ['https://terra.money/assets/img/favicon_196.png'],
          name: 'Station',
        },
      },
      pushServerOpts
    )
  }

  const recoverWalletConnect = (
    sessions: Record<string, IWalletConnectSession>
  ): void => {
    if (_.some(sessions)) {
      const connectors = _.reduce(
        sessions,
        (result, session) => {
          const connector = newWalletConnect({
            session,
          })
          return {
            ...result,
            [connector.handshakeTopic]: connector,
          }
        },
        {}
      )
      setWalletConnectors(connectors)
    }
    setWalletConnectRecoverComplete(true)
  }

  const saveWalletConnector = (connector: WalletConnect): void => {
    setWalletConnectors((ori) => {
      return {
        ...ori,
        [connector.handshakeTopic]: connector,
      }
    })
  }

  const removeWalletConnect = (handshakeTopic: string): void => {
    setWalletConnectors((ori) => _.omit(ori, [handshakeTopic]))
  }

  const disconnectWalletConnect = (handshakeTopic: string): void => {
    const connector = walletConnectors[handshakeTopic]
    if (connector) {
      if (connector?.connected) {
        connector?.killSession()
      } else {
        connector?.rejectSession()
      }
    }
  }

  const disconnectAllWalletConnect = (): void => {
    _.forEach(walletConnectors, ({ handshakeTopic }) => {
      disconnectWalletConnect(handshakeTopic)
      removeWalletConnect(handshakeTopic)
    })
  }

  return {
    newWalletConnect,
    recoverWalletConnect,
    saveWalletConnector,
    removeWalletConnect,
    disconnectWalletConnect,
    disconnectAllWalletConnect,
  }
}

export default useWalletConnect
