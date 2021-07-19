import { useRecoilState } from 'recoil'
import {
  IWalletConnectOptions,
  IPushServerOptions,
} from '@walletconnect/types'
import _ from 'lodash'

import WalletConnectStore from 'stores/WalletConnectStore'
import WalletConnect from '@walletconnect/client'
import Preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'
import { jsonTryParse } from 'utils/util'
import useTx from './useTx'
import { useLoading } from './useLoading'
import { CreateTxOptions, isTxError } from '@terra-money/terra.js'

export enum ErrorCodeEnum {
  userDenied = 1, // User Denied
  createTxFailed = 2, // CreateTxFailed (no Txhash)
  txFailed = 3, // TxFailed (Broadcast with Txhash with fail)
  timeOut = 4, // Timeout
  etc = 99,
}

const useWalletConnect = (): {
  newWalletConnect: (
    connectorOpts: IWalletConnectOptions,
    pushServerOpts?: IPushServerOptions
  ) => WalletConnect
  recoverWalletConnect: () => Promise<void>
  saveWalletConnector: (connector: WalletConnect) => void
  removeWalletConnect: (handshakeTopic: string) => void
  disconnectWalletConnect: (handshakeTopic: string) => void
  rejectWalletConnectRequest: (props: {
    handshakeTopic: string
    id: number
    errorCode?: ErrorCodeEnum
    message: string
    txHash?: string
    raw_message?: any
  }) => void
  disconnectAllWalletConnect: () => void
  confirmSign: (props: {
    connector: WalletConnect
    password: string
    address: string
    walletName: string
    tx: CreateTxOptions
    id: number
  }) => Promise<{ title: string; content: string; button: string }>
} => {
  const [walletConnectors, setWalletConnectors] = useRecoilState(
    WalletConnectStore.walletConnectors
  )

  const { broadcastTx } = useTx()
  const { showLoading, hideLoading } = useLoading()

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

  const rejectWalletConnectRequest = ({
    handshakeTopic,
    id,
    errorCode = ErrorCodeEnum.etc,
    message,
    txHash,
    raw_message,
  }: {
    handshakeTopic: string
    id: number
    errorCode?: ErrorCodeEnum
    message: string
    txHash?: string
    raw_message?: any
  }): void => {
    const connector = walletConnectors[handshakeTopic]
    if (connector) {
      connector.rejectRequest({
        id,
        error: {
          message: JSON.stringify({
            code: errorCode,
            message,
            txHash,
            raw_message,
          }),
        },
      })
    }
  }

  const confirmSign = async ({
    connector,
    password,
    address,
    walletName,
    tx,
    id,
  }: {
    connector: WalletConnect
    password: string
    address: string
    walletName: string
    tx: CreateTxOptions
    id: number
  }): Promise<{ title: string; content: string; button: string }> => {
    try {
      showLoading()

      const data = await broadcastTx({
        address,
        walletName,
        password,
        tx,
      })

      let title = ''
      let content = ''
      if (isTxError(data)) {
        title = 'Error!'
        content = `Oops! Something went wrong\n${data.raw_log}`
        rejectWalletConnectRequest({
          handshakeTopic: connector.handshakeTopic,
          id,
          errorCode: ErrorCodeEnum.txFailed,
          message: data.raw_log,
          txHash: data.txhash,
          raw_message: data,
        })
      } else {
        title = 'Success!'
        content =
          'Your transaction has been successfully processed. Return to your browser and continue.'
        connector.approveRequest({
          id,
          result: data,
        })
      }

      hideLoading()
      return {
        title,
        content,
        button: 'Continue',
      }
    } catch (error) {
      rejectWalletConnectRequest({
        handshakeTopic: connector.handshakeTopic,
        id,
        errorCode: ErrorCodeEnum.createTxFailed,
        message: _.toString(error),
      })
      hideLoading()
      return {
        title: 'Error',
        content: _.toString(error),
        button: 'Continue',
      }
    }
  }
  return {
    newWalletConnect,
    recoverWalletConnect,
    saveWalletConnector,
    removeWalletConnect,
    rejectWalletConnectRequest,
    disconnectWalletConnect,
    disconnectAllWalletConnect,
    confirmSign,
  }
}

export default useWalletConnect
