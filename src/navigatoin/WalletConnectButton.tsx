import React, {
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  AppState,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { useRecoilState } from 'recoil'
import { NavigationContainerRef } from '@react-navigation/native'
import _ from 'lodash'

import { COLOR } from 'consts'

import WalletConnectStore from 'stores/WalletConnectStore'
import { Text } from 'components'
import images from 'assets/images'
import useWalletConnect from 'hooks/useWalletConnect'

const WalletConnectButton = ({
  navigatorRef,
}: {
  navigatorRef: React.RefObject<NavigationContainerRef>
}): ReactElement => {
  const appState = useRef<string>(AppState.currentState)

  const [walletConnectors] = useRecoilState(
    WalletConnectStore.walletConnectors
  )
  const [showButton, setShowButton] = useState(true)
  const {
    recoverWalletConnect,
    removeWalletConnect,
  } = useWalletConnect()

  const handleAppStateChange = (nextAppState: string): void => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      recoverWalletConnect()
    }

    appState.current = nextAppState
  }

  useEffect(() => {
    if (_.some(walletConnectors)) {
      _.forEach(walletConnectors, (connector) => {
        const handshakeTopic = connector.handshakeTopic

        connector.on('call_request', async (error, req) => {
          const id = req.id
          const method = req.method
          const params = req.params[0]
          if (navigatorRef.current) {
            if (method === 'post') {
              navigatorRef.current.navigate('WalletConnectConfirm', {
                id,
                params,
                handshakeTopic,
              })
            }
          }
        })

        connector.on('disconnect', () => {
          removeWalletConnect(handshakeTopic)
        })
      })
    }
  }, [walletConnectors])

  useEffect(() => {
    if (navigatorRef.current) {
      navigatorRef.current.addListener('state', (val) => {
        const routes = _.clone(val.data.state?.routes)
        const currentRouteName = routes?.pop()?.name || ''
        const hideRoute = [
          'WalletConnect',
          'WalletConnectConfirm',
          'WalletConnectList',
          'Complete',
          'WalletConnectConfirmPassword',
          'ConfirmPassword',
          'Password',
          'Confirm',
          'SwapMultipleCoins',
          'Delegate',
        ].includes(currentRouteName)
        setShowButton(false === hideRoute)
      })
    }

    recoverWalletConnect()

    AppState.addEventListener('change', handleAppStateChange)

    return (): void => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  return (
    <View>
      {_.some(walletConnectors) && showButton && (
        <TouchableOpacity
          style={styles.walletConnect}
          onPress={(): void => {
            navigatorRef.current?.navigate('WalletConnectList')
          }}
        >
          <Image
            source={images.walletconnect_white}
            style={{ width: 18, height: 18 }}
          />
          <Text
            style={{
              paddingTop: 5,
              color: 'white',
              fontSize: 9,
              fontStyle: 'normal',
              letterSpacing: 0,
            }}
            fontType="bold"
          >
            CONNECTED
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default WalletConnectButton

const styles = StyleSheet.create({
  walletConnect: {
    position: 'absolute',
    alignItems: 'center',
    right: 0,
    bottom: 100,
    padding: 8,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: COLOR.primary._03,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    shadowOpacity: 1,
  },
})
