import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import _ from 'lodash'
import { AppState, BackHandler, ToastAndroid, Linking, View, Image, StyleSheet, Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import { getVersion } from 'react-native-device-info'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import WalletConnect from '@walletconnect/client'
import {
  authenticateBiometric,
  isSupportedBiometricAuthentication,
} from 'utils/bio'
import useWalletConnect from 'hooks/useWalletConnect'
import AppStore from 'stores/AppStore'
import { User } from 'lib/types'
import WalletConnectStore from 'stores/WalletConnectStore'
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'
import { LedgerKey } from '@terra-money/ledger-terra-js'
import {
  LCDClient,
  CreateTxOptions,
  Fee,
  Msg,
  SignatureV2,
  SignDoc,
} from '@terra-money/terra.js'
import { settings } from 'utils/storage'
import { useConfig, useIsClassic } from 'lib'
import useNetworks from 'hooks/useNetworks'
import { checkCameraPermission, requestPermission, requestPermissionBLE} from 'utils/permission'
import { UTIL } from 'consts'
import images from 'assets/images'

export const RN_APIS = {
  APP_VERSION: 'APP_VERSION',
  MIGRATE_KEYSTORE: 'MIGRATE_KEYSTORE',
  SET_NETWORK: 'SET_NETWORK',
  SET_THEME: 'SET_THEME',
  CHECK_BIO: 'CHECK_BIO',
  AUTH_BIO: 'AUTH_BIO',
  DEEPLINK: 'DEEPLINK',
  QR_SCAN: 'QR_SCAN',
  RECOVER_SESSIONS: 'RECOVER_SESSIONS',
  DISCONNECT_SESSIONS: 'DISCONNECT_SESSIONS',
  READY_CONNECT_WALLET: 'READY_CONNECT_WALLET',
  CONNECT_WALLET: 'CONNECT_WALLET',
  REJECT_SESSION: 'REJECT_SESSION',
  CONFIRM_TX: 'CONFIRM_TX',
  APPROVE_TX: 'APPROVE_TX',
  REJECT_TX: 'REJECT_TX',
  GET_LEDGER_LIST: 'GET_LEDGER_LIST',
  GET_LEDGER_KEY: 'GET_LEDGER_KEY',
  GET_LEDGER_DOC: 'GET_LEDGER_DOC',
}

interface DeviceInterface {
  name: string
  id: string
}

const uri = 'https://mobile.station.terra.money'

export const WebViewContainer = ({
  user,
  setIsVisibleModal,
}: {
  user?: User[]
  setIsVisibleModal?: any
}) => {
  const appState = useRef<string>(AppState.currentState)
  const { chain, theme } = useConfig()
  const { networks } = useNetworks()
  const isClassic = useIsClassic()
  const { top: insetTop, bottom: insetBottom } = useSafeAreaInsets()

  const {
    newWalletConnect,
    recoverWalletConnect,
    removeWalletConnect,
    saveWalletConnector,
    disconnectWalletConnect,
    disconnectAllWalletConnect,
  } = useWalletConnect()
  const webviewInstance = useRecoilValue(AppStore.webviewInstance)
  const walletConnectors = useRecoilValue(
    WalletConnectStore.walletConnectors
  )
  const setWebviewLoadEnd = useSetRecoilState(AppStore.webviewLoadEnd)
  const setWebviewComponentLoaded = useSetRecoilState(AppStore.webviewComponentLoaded)

  const [localWalletConnector, setLocalWalletConnector] =
    useState<WalletConnect | null>(null)

  const [canGoBack, setCanGoBack] = useState(false)
  const [, setScanning] = useState(false)
  const [, setError] = useState('')
  const [ledgers, setLedgers] = useState<DeviceInterface[]>([])
  const [ledgerReqId, setLedgerReqId] = useState<string>('')

  let exitAppTimeout: NodeJS.Timeout | null = null
  let isExit = false

  interface TxResponse<T = any> {
    success: boolean
    result?: T
    error?: { code: number; message?: string }
  }
  interface DefaultRequest extends PrimitiveDefaultRequest {
    timestamp: Date
  }

  interface TxRequest extends DefaultRequest {
    tx: CreateTxOptions
    requestType: 'signBytes' | 'post'
  }

  interface PrimitiveDefaultRequest {
    id: number
    origin: string
  }

  interface PrimitiveTxRequest
    extends Partial<TxResponse>,
      PrimitiveDefaultRequest {
    msgs: string[]
    fee?: string
    memo?: string
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const requestAppVersion = async () => {
    try {
      const appVersion = `v${getVersion()}`
      return appVersion
    } catch (e) {
      console.log(e)
    }
  }

  const parseTx = (request: PrimitiveTxRequest, isClassic: boolean): TxRequest['tx'] => {
    const { msgs, fee, memo } = request
    const isProto = "@type" in JSON.parse(msgs[0])
    return isProto
      ? {
        msgs: msgs.map((msg) => Msg.fromData(JSON.parse(msg), isClassic)),
        fee: fee ? Fee.fromData(JSON.parse(fee)) : undefined,
        memo,
      }
      : {
        msgs: msgs.map((msg) => Msg.fromAmino(JSON.parse(msg), isClassic)),
        fee: fee ? Fee.fromAmino(JSON.parse(fee)) : undefined,
        memo,
      }
  }

  const getCircularReplacer = () => {
    const seen = new WeakSet()

    return (key: any, value: Record<string, unknown> | null) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return
        }
        seen.add(value)
      }
      if (typeof value === 'function') {
        return `(${value})`
      }
      return value
    }
  }

  const WebViewListener = useCallback(
    async (req) => {
      if (webviewInstance.current) {
        if (!req) {
          return
        }
        const { data, type, reqId } = req

        switch (type) {
          case RN_APIS.APP_VERSION: {
            // type: APP_VERSION
            // data: string
            const version = await requestAppVersion()
            webviewInstance.current?.postMessage(
              JSON.stringify({
                reqId,
                type,
                data: version,
              })
            )
            break
          }
          case RN_APIS.SET_THEME: {
            // type: SET_THEME
            // data: boolean
            theme.set(data)
            settings.set({ theme: data })
            webviewInstance.current?.postMessage(
              JSON.stringify({
                reqId,
                type,
                data: true,
              })
            )
            break
          }
          case RN_APIS.SET_NETWORK: {
            // type: SET_NETWORK
            // data: boolean
            // @ts-ignore
            const nextChain = networks?.[data]
            settings.set({ chain: nextChain })
            chain.set(nextChain)

            webviewInstance.current?.postMessage(
              JSON.stringify({
                reqId,
                type,
                data: true,
              })
            )
            break
          }

          case RN_APIS.RECOVER_SESSIONS: {
            // type: RECOVER_SESSIONS
            // data: boolean
            recoverWalletConnect(data)
            webviewInstance.current?.postMessage(
              JSON.stringify({
                reqId,
                type,
                data: true,
              })
            )
            break
          }

          case RN_APIS.DISCONNECT_SESSIONS: {
            // type: DISCONNECT_SESSIONS
            // data: boolean
            if (data) {
              disconnectWalletConnect(data)
            } else {
              disconnectAllWalletConnect()
            }
            webviewInstance.current?.postMessage(
              JSON.stringify({
                reqId,
                type,
                data: true,
              })
            )
            break
          }

          case RN_APIS.REJECT_SESSION: {
            localWalletConnector?.rejectSession()
            break
          }

          case RN_APIS.READY_CONNECT_WALLET: {
            await connect({
              uri: data?.uri,
              reqId,
              type,
            })
            break
          }

          case RN_APIS.CONNECT_WALLET: {
            confirmConnect({
              userAddress: data?.userAddress,
            })

            if (!localWalletConnector?.session.peerMeta) {
              webviewInstance.current?.postMessage(
                JSON.stringify({
                  reqId,
                  type,
                  data: 'Error: No peerMeta data',
                })
              )
              return
            }

            // type: CONNECT_WALLET
            // data: session
            webviewInstance.current?.postMessage(
              JSON.stringify({
                reqId,
                type,
                data: localWalletConnector?.session,
              })
            )
            break
          }

          case RN_APIS.MIGRATE_KEYSTORE: {
            setWebviewLoadEnd(true)
            webviewInstance.current?.postMessage(
              JSON.stringify({
                reqId: req.reqId,
                type: type,
                data: user,
              })
            )
            break
          }

          case RN_APIS.CHECK_BIO: {
            const isSuccess = await isSupportedBiometricAuthentication()
            webviewInstance.current?.postMessage(
              JSON.stringify({
                reqId,
                type,
                data: isSuccess,
              })
            )
            break
          }

          case RN_APIS.AUTH_BIO: {
            const isSuccess = await authenticateBiometric()
            if (isSuccess) {
              webviewInstance.current?.postMessage(
                JSON.stringify({
                  reqId,
                  type,
                  data: isSuccess,
                })
              )
            } else {
              webviewInstance.current?.postMessage(
                JSON.stringify({
                  reqId,
                  type,
                  data: 'Error: Bio authentication not authorized, Check your app permissions.',
                })
              )
            }

            break
          }

          case RN_APIS.QR_SCAN: {
            const requestResult = await requestPermission()
            if (requestResult === 'granted') {
              const permission = await checkCameraPermission()
              if (permission === 'granted') {
                setIsVisibleModal(reqId)
                return
              }
            } else {
              webviewInstance.current?.postMessage(
                JSON.stringify({
                  reqId,
                  type,
                  data: 'Error: Camera not authorized, Check your app permissions.',
                })
              )
            }
            break
          }

          case RN_APIS.GET_LEDGER_LIST: {
            const requestResult = await requestPermissionBLE()
            if (requestResult === 'granted') {
              setLedgerReqId(reqId)
              searchLedger()
              return
            } else {
              webviewInstance.current?.postMessage(
                JSON.stringify({
                  reqId,
                  type,
                  data: 'Error: Bluetooth not authorized, Check your app permissions.',
                })
              )
            }
            break
          }

          case RN_APIS.GET_LEDGER_KEY: {
            const ledgerId = await TransportBLE.open(data.id)
            const disconnectLedger = () => TransportBLE.disconnect(data.id)
            try {
              const key = await LedgerKey.create(
                ledgerId,
                parseInt(data.path)
              )

              if (!data.hasOwnProperty('txOptions')) {
                const json = JSON.stringify(
                  key,
                  getCircularReplacer()
                )
                webviewInstance.current?.postMessage(
                  JSON.stringify({
                    reqId,
                    type,
                    data: json,
                  })
                )
                return
              }

              const lcd = new LCDClient(data?.lcdConfigs)
              const wallet = lcd.wallet(key)

              const { account_number, sequence } =
                await wallet.accountNumberAndSequence()

              const unsignedTx = await lcd.tx.create(
                [
                  {
                    address: data.address,
                  },
                ],
                parseTx(data.txOptions, isClassic)
              )

              const options = {
                chainID: data?.lcdConfigs.chainID,
                accountNumber: account_number,
                sequence,
                signMode: SignatureV2.SignMode.SIGN_MODE_LEGACY_AMINO_JSON
              }

              const signed = await key.signTx(
                unsignedTx,
                options,
                isClassic
              )
              const result = await lcd.tx.broadcastSync(signed)

              const json = JSON.stringify(
                result,
                getCircularReplacer()
              )
              webviewInstance.current?.postMessage(
                JSON.stringify({
                  reqId,
                  type,
                  data: json,
                })
              )
            } catch (error) {
              webviewInstance.current?.postMessage(
                JSON.stringify({
                  reqId,
                  type,
                  data: error?.toString(),
                })
              )
            } finally {
              disconnectLedger()
            }
            break
          }

          case RN_APIS.GET_LEDGER_DOC: {
            const ledgerId = await TransportBLE.open(data.id)
            const disconnectLedger = () => TransportBLE.disconnect(data.id)
            try {
              const key = await LedgerKey.create(
                ledgerId,
                parseInt(data.path)
              )

              const lcd = new LCDClient(data?.lcdConfigs)
              const accountInfo = await lcd.auth.accountInfo(data.address)
              const decoded = lcd.tx.decode(data.signTx)

              const doc = new SignDoc(
                data?.lcdConfigs.chainID,
                accountInfo.getAccountNumber(),
                accountInfo.getSequenceNumber(),
                decoded.auth_info,
                decoded.body
              )

              const signature = await key.createSignatureAmino(
                doc,
                isClassic
              )
              const string = JSON.stringify(signature.toData())
              const base64sign = Buffer.from(string).toString("base64")

              webviewInstance.current?.postMessage(
                JSON.stringify({
                  reqId,
                  type,
                  data: base64sign,
                })
              )
            } catch (error) {
              webviewInstance.current?.postMessage(
                JSON.stringify({
                  reqId,
                  type,
                  data: error?.toString(),
                })
              )
            } finally {
              disconnectLedger()
            }
            break
          }

          case RN_APIS.APPROVE_TX: {
            const connector = walletConnectors[data.handshakeTopic]

            connector?.approveRequest({
              id: data?.id,
              result: data?.result,
            })

            webviewInstance.current?.postMessage(
              JSON.stringify({
                reqId,
                type,
                data: true,
              })
            )
            break
          }

          case RN_APIS.REJECT_TX: {
            const connector = walletConnectors[data.handshakeTopic]

            connector?.rejectRequest({
              id: data?.id,
              error: {
                message: JSON.stringify(data?.errorMsg),
              },
            })

            webviewInstance.current?.postMessage(
              JSON.stringify({
                reqId,
                type,
                data: true,
              })
            )
            break
          }
        }
      }
    },
    [webviewInstance, user, localWalletConnector, walletConnectors]
  )

  const confirmConnect = useCallback(
    async ({ userAddress }) => {
      if (localWalletConnector) {
        const { peerMeta } = localWalletConnector

        // @ts-ignore
        if (peerMeta === 'null' || !peerMeta) {
          setLocalWalletConnector(null)
          return
        } else {
          await localWalletConnector.approveSession({
            chainId: chain.current.walletconnectID,
            accounts: [userAddress],
          })
        }

        saveWalletConnector(localWalletConnector)

        return peerMeta?.name ? true : false
      }
    },
    [localWalletConnector]
  )

  const connect = async ({
    uri,
    reqId,
    type,
  }: any): Promise<void> => {
    try {
      const connector = newWalletConnect({ uri })

      if (!connector.connected) {
        await connector.createSession()
      }
      setLocalWalletConnector(connector)
      connector.on('session_request', (error, payload) => {
        if (error) {
          setLocalWalletConnector(null)
          webviewInstance.current?.postMessage(
            JSON.stringify({
              reqId,
              type,
              data: 'Error: Fail session_request',
            })
          )
          return
        }

        const { peerMeta } = payload.params[0]

        webviewInstance.current?.postMessage(
          JSON.stringify({
            reqId,
            type,
            data: peerMeta,
          })
        )
      })
    } catch (error) {
      webviewInstance.current?.postMessage(
        JSON.stringify({
          reqId,
          type,
          data: 'Error: Fail session_request',
        })
      )
    }
  }

  const onBackPress = useCallback(() => {
    if (webviewInstance.current && canGoBack) {
      webviewInstance.current?.goBack()
      return true
    } else {
      if (isExit === false) {
        isExit = true
        ToastAndroid.show(
          'Click once more to exit.',
          ToastAndroid.SHORT
        )
        exitAppTimeout = setTimeout(
          () => {
            isExit = false
          },
          2000 // 2초
        )
        return true
      } else {
        if (exitAppTimeout !== null) {
          clearTimeout(exitAppTimeout)
        }
        BackHandler.exitApp() // 앱 종료
        return true
      }
    }
  }, [webviewInstance.current, canGoBack])

  const handleAppStateChange = useCallback(
    async (nextAppState: string): Promise<void> => {
      if (
        // nextAppState.match(/inactive|background/)
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (!localWalletConnector?.connected) {
          try {
            localWalletConnector?.rejectSession()
          } catch (e) {
            console.log('handleAppStateChange', e)
          }
        }
      }

      appState.current = nextAppState
    },
    [localWalletConnector]
  )

  const searchLedger = useCallback(() => {
    let stopScan = (): void => {}

    TransportBLE.observeState({
      next: (e: any) => {
        if (e.available) {
          setScanning(true)
          setError('')

          const scan = TransportBLE.listen({
            complete: (): void => {
              setScanning(false)
            },
            next: (e: any): void => {
              if (e.type === 'add') {
                const device: DeviceInterface = {
                  name: e.descriptor.localName || e.descriptor.name,
                  id: e.descriptor.id,
                }

                !ledgers.some((d) => d.id === device.id) &&
                ledgers.push(device)
                setLedgers([...ledgers])
              }
            },
            error: (error: any): void => {
              setScanning(false)
              setError(error)
            },
          })
          stopScan = (): void => {
            scan.unsubscribe()
          }
        } else {
          setError(e.type)
        }
      },
      complete: (): void => {},
      error: (error: any): void => {
        setScanning(false)
        setError(error)
      },
    })

    return (): void => {
      stopScan()
    }
  }, [])

  useEffect(() => {
    if (ledgers) {
      webviewInstance.current?.postMessage(
        JSON.stringify({
          reqId: ledgerReqId,
          type: RN_APIS.GET_LEDGER_LIST,
          data: ledgers,
        })
      )
    }
  }, [ledgers, ledgerReqId, webviewInstance])

  useEffect(() => {
    if (_.some(walletConnectors)) {
      _.forEach(walletConnectors, (connector) => {
        const handshakeTopic = connector.handshakeTopic

        connector.on('call_request', async (error, req) => {
          const id = req.id
          const method = req.method
          const params = req.params[0]
          
          if (method === 'post' || method === 'signBytes') {
            webviewInstance.current?.postMessage(
              JSON.stringify({
                reqId: '',
                type: RN_APIS.DEEPLINK,
                data: {
                  action: 'wallet_confirm',
                  payload: UTIL.toBase64(UTIL.jsonTryStringify({
                    id,
                    params,
                    handshakeTopic,
                    method
                  }))
                },
              })
            )
          }
        })

        connector.on('disconnect', () => {
          removeWalletConnect(handshakeTopic)

          webviewInstance.current?.postMessage(
            JSON.stringify({
              reqId: '',
              type: RN_APIS.DISCONNECT_SESSIONS,
              data: handshakeTopic,
            })
          )
        })
      })
    }
  }, [walletConnectors])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress)
    return (): void => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        onBackPress
      )
    }
  }, [onBackPress])

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)
    return (): void => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [handleAppStateChange])

  return (
    <WebView
      ref={webviewInstance}
      source={{
        uri
      }}
      onShouldStartLoadWithRequest={(request) => {
        if (!request.url.includes(uri)) {
          Linking.openURL(request.url)
          return false
        }
        return true
      }}
      allowsBackForwardNavigationGestures
      autoManageStatusBarEnabled={false}
      renderLoading={() => (
        <View style={styles.splashContainer}>
          <Image
            source={images.terraStation}
            style={{
              resizeMode: 'contain',
              alignSelf: 'center',
              marginTop: insetBottom - insetTop,
              width: Platform.OS === 'ios' ? 240 : '48%',
            }}
          />
        </View>
      )}
      startInLoadingState={true}
      scrollEnabled={false}
      contentInsetAdjustmentBehavior="scrollableAxes"
      onLoadProgress={(event) =>
        setCanGoBack(event.nativeEvent.canGoBack)
      }
      onLoadEnd={() => {
        setWebviewComponentLoaded(true)
      }}
      onMessage={async (message) => {
        const { nativeEvent } = message
        const req = nativeEvent.data && JSON.parse(nativeEvent.data)
        await WebViewListener(req)
      }}
      onContentProcessDidTerminate={(): void =>
        (webviewInstance?.current as unknown as WebView)?.reload()
      }
      injectedJavaScript={`
        (function() {
          function wrap(fn) {
            return function wrapper() {
              var res = fn.apply(this, arguments);
              window.ReactNativeWebView.postMessage('navigationStateChange');
              return res;
            }
          }å
          history.pushState = wrap(history.pushState);
          history.replaceState = wrap(history.replaceState);
          window.addEventListener('popstate', function() {
            window.ReactNativeWebView.postMessage('navigationStateChange');
          });
        })();
        true;
      `}
    />
  )
}

const styles = StyleSheet.create({
  splashContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: '#1f42b4',
    alignContent: 'center',
    justifyContent: 'center',
  },
})
