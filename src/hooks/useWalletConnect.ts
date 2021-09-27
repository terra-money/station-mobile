import { useRecoilState, useSetRecoilState } from 'recoil'
import {
  IWalletConnectOptions,
  IPushServerOptions,
} from '@walletconnect/types'
import WalletConnect from '@walletconnect/client'
import _ from 'lodash'

import WalletConnectStore from 'stores/WalletConnectStore'
import Preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'
import { jsonTryParse } from 'utils/util'

const useWalletConnect = (): {
  newWalletConnect: (
    connectorOpts: IWalletConnectOptions,
    pushServerOpts?: IPushServerOptions
  ) => WalletConnect
  recoverWalletConnect: () => Promise<void>
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

  const recoverWalletConnect = async (): Promise<void> => {
    const sessionData = await Preferences.getString(
      PreferencesEnum.walletConnectSession
    )
    if (_.some(sessionData)) {
      const sessions = jsonTryParse<any[]>(sessionData)
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

    const sessions = _.filter(walletConnectors, (c) => c?.connected)
      .map((x) => x.session)
      .concat([connector.session])

    Preferences.setString(
      PreferencesEnum.walletConnectSession,
      JSON.stringify(sessions)
    )
  }

  const removeWalletConnect = (handshakeTopic: string): void => {
    setWalletConnectors((ori) => _.omit(ori, [handshakeTopic]))
    const sessionList = _.filter(
      walletConnectors,
      (c) => c?.connected && c.handshakeTopic !== handshakeTopic
    ).map((x) => x.session)
    Preferences.setString(
      PreferencesEnum.walletConnectSession,
      JSON.stringify(sessionList)
    )
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
